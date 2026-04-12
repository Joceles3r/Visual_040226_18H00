-- ============================================================================
-- VIXUAL Migration 031: Admin Audit Log
-- PATCH SUPER-REMEDE: Table pour tracer les actions admin
-- ============================================================================

-- Table pour logger toutes les actions administratives
CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor TEXT NOT NULL,              -- identifiant de l'acteur (user_id ou email)
  actor_email TEXT,                 -- email de l'acteur
  action TEXT NOT NULL,             -- type d'action (stripe_settings_updated, user_banned, etc.)
  target TEXT,                      -- cible de l'action (user_id, config_key, etc.)
  target_type TEXT,                 -- type de cible (user, stripe_config, content, etc.)
  ip_address TEXT,                  -- adresse IP de l'acteur
  user_agent TEXT,                  -- user agent du navigateur
  metadata JSONB DEFAULT '{}',      -- donnees supplementaires contextuelles
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les recherches frequentes
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_actor ON admin_audit_log(actor);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target ON admin_audit_log(target);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON admin_audit_log(created_at DESC);

-- Index composite pour les recherches par acteur et date
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_actor_date ON admin_audit_log(actor, created_at DESC);

-- Commentaire sur la table
COMMENT ON TABLE admin_audit_log IS 'Trace toutes les actions administratives pour audit et securite';
