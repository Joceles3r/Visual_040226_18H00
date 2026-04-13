-- =============================================================================
-- VIXUAL RANKING MODULE — TABLES ET COLONNES
-- Selection des 100 projets, file d'attente equitable, reintegration payante
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Table: category_sessions
-- Gere les sessions de classement par categorie
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS category_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_key TEXT NOT NULL CHECK (category_key IN ('video', 'text', 'podcast')),
  starts_at TIMESTAMP NOT NULL,
  ends_at TIMESTAMP NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'active', 'closed', 'archived')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMP NULL,
  UNIQUE(category_key, starts_at)
);

-- Index pour recherches frequentes
CREATE INDEX IF NOT EXISTS idx_category_sessions_status ON category_sessions(status);
CREATE INDEX IF NOT EXISTS idx_category_sessions_category ON category_sessions(category_key);

-- -----------------------------------------------------------------------------
-- Table: project_queue
-- File d'attente officielle et equitable
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  category_key TEXT NOT NULL CHECK (category_key IN ('video', 'text', 'podcast')),
  queue_position INT NOT NULL,
  inserted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'selected', 'expired', 'withdrawn')),
  selected_at TIMESTAMP NULL,
  UNIQUE(project_id, category_key)
);

-- Index pour tri par position
CREATE INDEX IF NOT EXISTS idx_project_queue_position ON project_queue(category_key, queue_position);
CREATE INDEX IF NOT EXISTS idx_project_queue_status ON project_queue(status);

-- -----------------------------------------------------------------------------
-- Table: project_reentry_payments
-- Paiements de reintegration prioritaire (25 EUR)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project_reentry_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES contents(id) ON DELETE CASCADE,
  owner_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES category_sessions(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL DEFAULT 25.00,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'expired', 'refunded')),
  stripe_payment_intent_id TEXT NULL,
  stripe_checkout_session_id TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMP NULL,
  expires_at TIMESTAMP NOT NULL,
  UNIQUE(project_id, session_id)
);

-- Index pour recherches de paiements
CREATE INDEX IF NOT EXISTS idx_reentry_payments_status ON project_reentry_payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_reentry_payments_session ON project_reentry_payments(session_id);
CREATE INDEX IF NOT EXISTS idx_reentry_payments_user ON project_reentry_payments(owner_user_id);

-- -----------------------------------------------------------------------------
-- Colonnes supplementaires pour la table contents (projets)
-- -----------------------------------------------------------------------------
ALTER TABLE contents
ADD COLUMN IF NOT EXISTS session_id UUID NULL REFERENCES category_sessions(id),
ADD COLUMN IF NOT EXISTS queue_position INT NULL,
ADD COLUMN IF NOT EXISTS selected_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS total_votes INT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS reached_score_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS final_rank INT NULL,
ADD COLUMN IF NOT EXISTS is_top10_winner BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reentry_eligible BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reentry_window_starts_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS reentry_window_expires_at TIMESTAMP NULL,
ADD COLUMN IF NOT EXISTS reentry_paid BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS reentry_paid_at TIMESTAMP NULL;

-- Index pour classement et recherches
CREATE INDEX IF NOT EXISTS idx_contents_session ON contents(session_id);
CREATE INDEX IF NOT EXISTS idx_contents_total_votes ON contents(total_votes DESC);
CREATE INDEX IF NOT EXISTS idx_contents_reentry ON contents(reentry_eligible, reentry_window_expires_at);

-- -----------------------------------------------------------------------------
-- Fonction: get_next_queue_position
-- Retourne la prochaine position disponible dans la file d'attente
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_next_queue_position(p_category_key TEXT)
RETURNS INT AS $$
DECLARE
  next_pos INT;
BEGIN
  SELECT COALESCE(MAX(queue_position), 0) + 1
  INTO next_pos
  FROM project_queue
  WHERE category_key = p_category_key AND status = 'waiting';
  
  RETURN next_pos;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- Fonction: count_selected_projects
-- Compte les projets actifs dans une session
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION count_selected_projects(p_category_key TEXT, p_session_id UUID)
RETURNS INT AS $$
DECLARE
  total INT;
BEGIN
  SELECT COUNT(*)
  INTO total
  FROM contents
  WHERE session_id = p_session_id
    AND type = p_category_key
    AND status IN ('selected', 'active');
  
  RETURN total;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- FIN DE LA MIGRATION
-- =============================================================================
