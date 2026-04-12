-- VIXUAL - Migration 030
-- Renommage visupoints -> vixupoints
-- Date: 2026-04-12
-- Description: Migration de nomenclature Visu* vers Vixu* dans la base de donnees

-- ================================================================
-- ATTENTION: Cette migration modifie des colonnes et des types
-- Effectuez une sauvegarde AVANT d'executer ce script
-- ================================================================

BEGIN;

-- ─────────────────────────────────────────────
-- 1. RENOMMER LA COLONNE visupoints DANS users
-- ─────────────────────────────────────────────
ALTER TABLE users 
  RENAME COLUMN visupoints TO vixupoints;

-- ─────────────────────────────────────────────
-- 2. RENOMMER LA COLONNE visupoints_granted DANS investments
-- ─────────────────────────────────────────────
ALTER TABLE investments 
  RENAME COLUMN visupoints_granted TO vixupoints_granted;

-- ─────────────────────────────────────────────
-- 3. METTRE A JOUR LE CHECK CONSTRAINT SUR wallet_transactions.type
-- ─────────────────────────────────────────────
-- D'abord supprimer l'ancienne contrainte
ALTER TABLE wallet_transactions 
  DROP CONSTRAINT IF EXISTS wallet_transactions_type_check;

-- Puis ajouter la nouvelle avec vixupoints_conversion
ALTER TABLE wallet_transactions 
  ADD CONSTRAINT wallet_transactions_type_check 
  CHECK (type IN (
    'investment', 'return', 'caution', 'caution_refund',
    'withdrawal', 'vixupoints_conversion', 'article_sale',
    'discovery_pass', 'ticket_gold', 'soutien_libre', 'micropack'
  ));

-- Mettre a jour les enregistrements existants
UPDATE wallet_transactions 
  SET type = 'vixupoints_conversion' 
  WHERE type = 'visupoints_conversion';

-- ─────────────────────────────────────────────
-- 4. CREER LA TABLE vixupoints_transactions SI ELLE N'EXISTE PAS
-- (remplace visupoints_transactions)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vixupoints_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  source TEXT,
  reference_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour les requetes frequentes
CREATE INDEX IF NOT EXISTS idx_vixupoints_transactions_user 
  ON vixupoints_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_vixupoints_transactions_action 
  ON vixupoints_transactions(action);
CREATE INDEX IF NOT EXISTS idx_vixupoints_transactions_created 
  ON vixupoints_transactions(created_at DESC);

-- ─────────────────────────────────────────────
-- 5. MIGRER LES DONNEES DE visupoints_transactions SI EXISTANTE
-- ─────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'visupoints_transactions') THEN
    -- Migrer les donnees existantes
    INSERT INTO vixupoints_transactions (
      id, user_id, action, amount, balance_after, source, 
      reference_id, ip_address, user_agent, created_at
    )
    SELECT 
      id, user_id, action, amount, balance_after, source,
      reference_id, ip_address, user_agent, created_at
    FROM visupoints_transactions
    ON CONFLICT (id) DO NOTHING;
    
    -- Optionnel: Renommer l'ancienne table (garder pour backup)
    ALTER TABLE visupoints_transactions RENAME TO visupoints_transactions_backup;
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- 6. CREER LA TABLE vixupoints_balance SI ELLE N'EXISTE PAS
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vixupoints_balance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_spent INTEGER NOT NULL DEFAULT 0,
  last_daily_credit_at DATE,
  daily_credits_today INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_vixupoints_balance_user 
  ON vixupoints_balance(user_id);

-- ─────────────────────────────────────────────
-- 7. MIGRER LES DONNEES DE visupoints_balance SI EXISTANTE
-- ─────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'visupoints_balance') THEN
    -- Migrer les donnees existantes
    INSERT INTO vixupoints_balance (
      id, user_id, balance, lifetime_earned, lifetime_spent,
      last_daily_credit_at, daily_credits_today, updated_at
    )
    SELECT 
      id, user_id, balance, lifetime_earned, lifetime_spent,
      last_daily_credit_at, daily_credits_today, updated_at
    FROM visupoints_balance
    ON CONFLICT (user_id) DO UPDATE SET
      balance = EXCLUDED.balance,
      lifetime_earned = EXCLUDED.lifetime_earned,
      lifetime_spent = EXCLUDED.lifetime_spent,
      last_daily_credit_at = EXCLUDED.last_daily_credit_at,
      daily_credits_today = EXCLUDED.daily_credits_today,
      updated_at = now();
    
    -- Optionnel: Renommer l'ancienne table (garder pour backup)
    ALTER TABLE visupoints_balance RENAME TO visupoints_balance_backup;
  END IF;
END $$;

-- ─────────────────────────────────────────────
-- 8. METTRE A JOUR LE COMMENTAIRE DU SCHEMA
-- ─────────────────────────────────────────────
COMMENT ON TABLE users IS 'VIXUAL - Utilisateurs de la plateforme';
COMMENT ON COLUMN users.vixupoints IS 'Solde VIXUpoints de l utilisateur';
COMMENT ON TABLE vixupoints_transactions IS 'VIXUAL - Historique des transactions VIXUpoints';
COMMENT ON TABLE vixupoints_balance IS 'VIXUAL - Solde detaille VIXUpoints par utilisateur';

-- ─────────────────────────────────────────────
-- 9. FONCTION DE SYNCHRONISATION vixupoints
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION sync_user_vixupoints()
RETURNS TRIGGER AS $$
BEGIN
  -- Met a jour le solde dans users quand vixupoints_balance change
  UPDATE users 
  SET vixupoints = NEW.balance,
      updated_at = now()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour synchroniser
DROP TRIGGER IF EXISTS trigger_sync_vixupoints ON vixupoints_balance;
CREATE TRIGGER trigger_sync_vixupoints
  AFTER INSERT OR UPDATE ON vixupoints_balance
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_vixupoints();

COMMIT;

-- ─────────────────────────────────────────────
-- VERIFICATION POST-MIGRATION
-- ─────────────────────────────────────────────
-- Executez ces requetes pour verifier la migration:
--
-- SELECT column_name FROM information_schema.columns 
--   WHERE table_name = 'users' AND column_name = 'vixupoints';
--
-- SELECT column_name FROM information_schema.columns 
--   WHERE table_name = 'investments' AND column_name = 'vixupoints_granted';
--
-- SELECT COUNT(*) FROM vixupoints_transactions;
-- SELECT COUNT(*) FROM vixupoints_balance;
