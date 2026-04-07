-- ============================================================
-- UnionManager Africa - Schéma PostgreSQL Complet
-- Version: 1.0.0
-- ============================================================

-- Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- TABLE: organisations (syndicats multi-tenant)
-- ============================================================
CREATE TABLE organisations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(255) NOT NULL,
  sigle VARCHAR(50),
  adresse TEXT,
  telephone VARCHAR(20),
  email VARCHAR(255) UNIQUE,
  site_web VARCHAR(255),
  date_fondation DATE,
  numero_enregistrement VARCHAR(100),
  logo_url TEXT,
  pays VARCHAR(100) DEFAULT 'Sénégal',
  devise VARCHAR(10) DEFAULT 'FCFA',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: utilisateurs
-- ============================================================
CREATE TABLE utilisateurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  telephone VARCHAR(20),
  role VARCHAR(50) NOT NULL CHECK (role IN (
    'super_admin', 'president', 'secretaire_general',
    'tresorier', 'responsable_section', 'membre_bureau', 'lecteur'
  )),
  avatar_url TEXT,
  est_actif BOOLEAN DEFAULT TRUE,
  derniere_connexion TIMESTAMPTZ,
  refresh_token_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organisation_id, email)
);

CREATE INDEX idx_utilisateurs_org ON utilisateurs(organisation_id);
CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);

-- ============================================================
-- TABLE: regions
-- ============================================================
CREATE TABLE regions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  nom VARCHAR(100) NOT NULL,
  code VARCHAR(20),
  responsable_id UUID REFERENCES utilisateurs(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(organisation_id, nom)
);

-- ============================================================
-- TABLE: sections (sections syndicales)
-- ============================================================
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  region_id UUID REFERENCES regions(id),
  nom VARCHAR(150) NOT NULL,
  description TEXT,
  responsable_id UUID REFERENCES utilisateurs(id),
  date_creation DATE DEFAULT CURRENT_DATE,
  est_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sections_org ON sections(organisation_id);

-- ============================================================
-- TABLE: membres
-- ============================================================
CREATE TABLE membres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  section_id UUID REFERENCES sections(id),
  region_id UUID REFERENCES regions(id),
  -- Identifiant unique lisible
  numero_adherent VARCHAR(30) UNIQUE NOT NULL,
  -- Informations personnelles
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  sexe CHAR(1) CHECK (sexe IN ('M', 'F')),
  date_naissance DATE,
  lieu_naissance VARCHAR(150),
  nationalite VARCHAR(100) DEFAULT 'Sénégalaise',
  numero_cni VARCHAR(50),
  -- Contact
  telephone VARCHAR(20),
  telephone_2 VARCHAR(20),
  email VARCHAR(255),
  adresse TEXT,
  -- Professionnel
  profession VARCHAR(150),
  entreprise VARCHAR(200),
  poste VARCHAR(150),
  -- Syndicat
  date_adhesion DATE DEFAULT CURRENT_DATE,
  statut VARCHAR(20) DEFAULT 'actif' CHECK (statut IN ('actif', 'inactif', 'suspendu', 'retraite', 'decede')),
  -- Cotisation
  montant_cotisation_mensuel NUMERIC(12, 2) DEFAULT 2500,
  -- Médias
  photo_url TEXT,
  documents JSONB DEFAULT '[]',
  -- Audit
  cree_par UUID REFERENCES utilisateurs(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_membres_org ON membres(organisation_id);
CREATE INDEX idx_membres_section ON membres(section_id);
CREATE INDEX idx_membres_statut ON membres(statut);
CREATE INDEX idx_membres_nom ON membres(nom, prenom);

-- Séquence pour numéro adhérent par organisation
CREATE SEQUENCE seq_adherent_global START 1;

-- ============================================================
-- TABLE: cotisations
-- ============================================================
CREATE TABLE cotisations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  membre_id UUID NOT NULL REFERENCES membres(id) ON DELETE CASCADE,
  -- Type et montant
  type_cotisation VARCHAR(30) NOT NULL CHECK (type_cotisation IN ('mensuelle', 'annuelle', 'exceptionnelle', 'solidarite')),
  montant NUMERIC(12, 2) NOT NULL,
  devise VARCHAR(10) DEFAULT 'FCFA',
  -- Période
  periode_mois INTEGER CHECK (periode_mois BETWEEN 1 AND 12),
  periode_annee INTEGER NOT NULL,
  libelle VARCHAR(200), -- pour cotisations exceptionnelles
  -- Paiement
  date_paiement DATE,
  mode_paiement VARCHAR(30) CHECK (mode_paiement IN ('especes', 'virement', 'cheque', 'mobile_money', 'prelevement')),
  reference_paiement VARCHAR(100),
  statut VARCHAR(20) DEFAULT 'en_attente' CHECK (statut IN ('payé', 'en_attente', 'retard', 'impayé', 'exonéré')),
  -- Note
  note TEXT,
  encaisse_par UUID REFERENCES utilisateurs(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cotisations_membre ON cotisations(membre_id);
CREATE INDEX idx_cotisations_statut ON cotisations(statut);
CREATE INDEX idx_cotisations_periode ON cotisations(periode_annee, periode_mois);

-- ============================================================
-- TABLE: reunions
-- ============================================================
CREATE TABLE reunions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  titre VARCHAR(255) NOT NULL,
  type_reunion VARCHAR(50) CHECK (type_reunion IN (
    'assemblee_generale', 'bureau_executif', 'negociation',
    'reunion_section', 'formation', 'extraordinaire'
  )),
  date_reunion DATE NOT NULL,
  heure_debut TIME,
  heure_fin TIME,
  lieu VARCHAR(300),
  description TEXT,
  ordre_du_jour JSONB DEFAULT '[]',
  statut VARCHAR(30) DEFAULT 'planifiée' CHECK (statut IN ('planifiée', 'en_cours', 'terminée', 'annulée', 'reportée')),
  compte_rendu TEXT,
  fichier_pv_url TEXT,
  cree_par UUID REFERENCES utilisateurs(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- TABLE: participants_reunion
CREATE TABLE participants_reunion (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reunion_id UUID NOT NULL REFERENCES reunions(id) ON DELETE CASCADE,
  membre_id UUID REFERENCES membres(id),
  utilisateur_id UUID REFERENCES utilisateurs(id),
  nom_externe VARCHAR(200), -- pour participants extérieurs
  est_present BOOLEAN DEFAULT FALSE,
  heure_arrivee TIME,
  heure_depart TIME,
  role_reunion VARCHAR(100), -- président de séance, rapporteur, etc.
  signature_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_participants_reunion ON participants_reunion(reunion_id);

-- ============================================================
-- TABLE: actions_syndicales
-- ============================================================
CREATE TABLE actions_syndicales (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  titre VARCHAR(255) NOT NULL,
  type_action VARCHAR(50) CHECK (type_action IN (
    'greve', 'manifestation', 'negociation', 'petition',
    'communique', 'sit_in', 'journee_mort', 'autre'
  )),
  description TEXT,
  date_debut DATE NOT NULL,
  date_fin DATE,
  lieu VARCHAR(300),
  revendications JSONB DEFAULT '[]',
  statut VARCHAR(30) DEFAULT 'planifiée' CHECK (statut IN ('planifiée', 'en_cours', 'terminée', 'annulée', 'suspendue')),
  resultat TEXT,
  nombre_participants INTEGER,
  budget NUMERIC(12, 2),
  responsable_id UUID REFERENCES utilisateurs(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: plaintes
-- ============================================================
CREATE TABLE plaintes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  reference VARCHAR(30) UNIQUE NOT NULL,
  -- Déclarant
  membre_declarant_id UUID REFERENCES membres(id),
  nom_declarant VARCHAR(200), -- si non-membre
  telephone_declarant VARCHAR(20),
  -- Mis en cause
  entreprise_mise_en_cause VARCHAR(200),
  personne_mise_en_cause VARCHAR(200),
  -- Plainte
  objet VARCHAR(500) NOT NULL,
  categorie VARCHAR(50) CHECK (categorie IN (
    'licenciement', 'harcelement', 'salaire', 'discrimination',
    'securite', 'contrat', 'heures_sup', 'reintegration', 'autre'
  )),
  priorite VARCHAR(20) DEFAULT 'normale' CHECK (priorite IN ('normale', 'haute', 'urgente')),
  description TEXT NOT NULL,
  preuves_urls JSONB DEFAULT '[]',
  -- Suivi
  statut VARCHAR(30) DEFAULT 'ouverte' CHECK (statut IN (
    'ouverte', 'en_instruction', 'en_mediation', 'en_arbitrage',
    'tribunal', 'resolue', 'classée', 'irrecevable'
  )),
  responsable_id UUID REFERENCES utilisateurs(id),
  date_resolution DATE,
  resultat_resolution TEXT,
  -- Timeline
  historique JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_plaintes_org ON plaintes(organisation_id);
CREATE INDEX idx_plaintes_statut ON plaintes(statut);
CREATE INDEX idx_plaintes_membre ON plaintes(membre_declarant_id);

-- ============================================================
-- TABLE: finances (transactions)
-- ============================================================
CREATE TABLE transactions_financieres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  type_transaction VARCHAR(20) NOT NULL CHECK (type_transaction IN ('recette', 'depense')),
  categorie VARCHAR(80) NOT NULL,
  -- Ex recettes: cotisations, dons, subventions, loyers
  -- Ex dépenses: fonctionnement, juridique, evenements, salaires, communication
  sous_categorie VARCHAR(80),
  montant NUMERIC(14, 2) NOT NULL,
  devise VARCHAR(10) DEFAULT 'FCFA',
  date_transaction DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT,
  reference_piece VARCHAR(100),
  piece_justificative_url TEXT,
  mode_paiement VARCHAR(30),
  tiers VARCHAR(200), -- fournisseur ou donateur
  cotisation_id UUID REFERENCES cotisations(id), -- si recette cotisation
  saisie_par UUID REFERENCES utilisateurs(id),
  valide_par UUID REFERENCES utilisateurs(id),
  est_valide BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_transactions_org ON transactions_financieres(organisation_id);
CREATE INDEX idx_transactions_type ON transactions_financieres(type_transaction);
CREATE INDEX idx_transactions_date ON transactions_financieres(date_transaction);

-- ============================================================
-- TABLE: documents
-- ============================================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  titre VARCHAR(255) NOT NULL,
  type_document VARCHAR(50) CHECK (type_document IN (
    'statuts', 'reglement', 'pv_reunion', 'rapport_annuel',
    'rapport_financier', 'convention', 'courrier', 'autre'
  )),
  description TEXT,
  fichier_url TEXT NOT NULL,
  fichier_nom VARCHAR(255),
  fichier_taille INTEGER, -- en octets
  mime_type VARCHAR(100),
  version VARCHAR(20),
  est_public BOOLEAN DEFAULT FALSE,
  tags JSONB DEFAULT '[]',
  telecharge_par UUID REFERENCES utilisateurs(id),
  reunion_id UUID REFERENCES reunions(id), -- si lié à une réunion
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_org ON documents(organisation_id);
CREATE INDEX idx_documents_type ON documents(type_document);

-- ============================================================
-- TABLE: messages (communication interne)
-- ============================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  expediteur_id UUID NOT NULL REFERENCES utilisateurs(id),
  sujet VARCHAR(300),
  contenu TEXT NOT NULL,
  type_message VARCHAR(30) CHECK (type_message IN ('direct', 'groupe', 'annonce', 'circulaire')),
  est_urgent BOOLEAN DEFAULT FALSE,
  -- Destinataires (peut être un utilisateur, section, ou toute l'org)
  destinataire_utilisateur_id UUID REFERENCES utilisateurs(id),
  destinataire_section_id UUID REFERENCES sections(id),
  est_pour_tous BOOLEAN DEFAULT FALSE,
  lu_par JSONB DEFAULT '[]', -- tableau d'IDs utilisateurs ayant lu
  piece_jointe_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_org ON messages(organisation_id);
CREATE INDEX idx_messages_expediteur ON messages(expediteur_id);

-- ============================================================
-- TABLE: annonces
-- ============================================================
CREATE TABLE annonces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id) ON DELETE CASCADE,
  titre VARCHAR(255) NOT NULL,
  contenu TEXT NOT NULL,
  type_annonce VARCHAR(30) CHECK (type_annonce IN ('info', 'urgente', 'reunion', 'action', 'resultat')),
  est_epinglée BOOLEAN DEFAULT FALSE,
  date_expiration DATE,
  image_url TEXT,
  cree_par UUID REFERENCES utilisateurs(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TABLE: audit_logs
-- ============================================================
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organisation_id UUID NOT NULL REFERENCES organisations(id),
  utilisateur_id UUID REFERENCES utilisateurs(id),
  action VARCHAR(100) NOT NULL,
  table_concernee VARCHAR(100),
  enregistrement_id UUID,
  donnees_avant JSONB,
  donnees_apres JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_org ON audit_logs(organisation_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);

-- ============================================================
-- FONCTIONS ET TRIGGERS
-- ============================================================

-- Mise à jour automatique updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur toutes les tables avec updated_at
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'organisations', 'utilisateurs', 'membres', 'sections', 'cotisations',
    'reunions', 'actions_syndicales', 'plaintes', 'transactions_financieres',
    'documents', 'annonces'
  ] LOOP
    EXECUTE format(
      'CREATE TRIGGER trg_update_%s_updated_at
       BEFORE UPDATE ON %s
       FOR EACH ROW EXECUTE FUNCTION update_updated_at()',
      t, t
    );
  END LOOP;
END;
$$;

-- Fonction: générer numéro adhérent
CREATE OR REPLACE FUNCTION generer_numero_adherent(org_id UUID)
RETURNS VARCHAR AS $$
DECLARE
  seq_val INTEGER;
  prefix VARCHAR(10);
BEGIN
  seq_val := nextval('seq_adherent_global');
  prefix := 'ADH';
  RETURN prefix || '-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(seq_val::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger: auto-générer numéro adhérent
CREATE OR REPLACE FUNCTION auto_numero_adherent()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.numero_adherent IS NULL OR NEW.numero_adherent = '' THEN
    NEW.numero_adherent := generer_numero_adherent(NEW.organisation_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_numero_adherent
BEFORE INSERT ON membres
FOR EACH ROW EXECUTE FUNCTION auto_numero_adherent();

-- Fonction: générer référence plainte
CREATE OR REPLACE FUNCTION auto_reference_plainte()
RETURNS TRIGGER AS $$
DECLARE
  seq_val INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SPLIT_PART(reference, '-', 3) AS INTEGER)), 0) + 1
  INTO seq_val
  FROM plaintes
  WHERE organisation_id = NEW.organisation_id
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM NOW());

  NEW.reference := 'PLT-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(seq_val::TEXT, 3, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auto_reference_plainte
BEFORE INSERT ON plaintes
FOR EACH ROW EXECUTE FUNCTION auto_reference_plainte();

-- ============================================================
-- VUE: tableau de bord stats
-- ============================================================
CREATE OR REPLACE VIEW vue_stats_organisation AS
SELECT
  o.id AS organisation_id,
  o.nom AS organisation_nom,
  COUNT(DISTINCT m.id) AS total_membres,
  COUNT(DISTINCT m.id) FILTER (WHERE m.statut = 'actif') AS membres_actifs,
  COUNT(DISTINCT m.id) FILTER (WHERE m.statut = 'inactif') AS membres_inactifs,
  COALESCE(SUM(c.montant) FILTER (WHERE c.statut = 'payé' AND c.periode_annee = EXTRACT(YEAR FROM NOW())::INT), 0) AS cotisations_annee,
  COALESCE(SUM(c.montant) FILTER (WHERE c.statut = 'payé' AND c.periode_mois = EXTRACT(MONTH FROM NOW())::INT AND c.periode_annee = EXTRACT(YEAR FROM NOW())::INT), 0) AS cotisations_mois,
  COUNT(DISTINCT r.id) FILTER (WHERE r.statut = 'planifiée' AND r.date_reunion >= CURRENT_DATE) AS reunions_planifiees,
  COUNT(DISTINCT p.id) FILTER (WHERE p.statut NOT IN ('resolue', 'classée')) AS plaintes_en_cours,
  COALESCE(SUM(tf.montant) FILTER (WHERE tf.type_transaction = 'recette'), 0) -
  COALESCE(SUM(tf.montant) FILTER (WHERE tf.type_transaction = 'depense'), 0) AS solde_tresorerie
FROM organisations o
LEFT JOIN membres m ON m.organisation_id = o.id
LEFT JOIN cotisations c ON c.membre_id = m.id
LEFT JOIN reunions r ON r.organisation_id = o.id
LEFT JOIN plaintes p ON p.organisation_id = o.id
LEFT JOIN transactions_financieres tf ON tf.organisation_id = o.id AND tf.est_valide = TRUE
GROUP BY o.id, o.nom;

-- ============================================================
-- VUE: membres avec retard de cotisation
-- ============================================================
CREATE OR REPLACE VIEW vue_membres_retard AS
SELECT
  m.id,
  m.organisation_id,
  m.numero_adherent,
  m.nom,
  m.prenom,
  m.telephone,
  m.email,
  s.nom AS section,
  r.nom AS region,
  m.montant_cotisation_mensuel,
  -- Nombre de mois de retard (simplification)
  GREATEST(0,
    EXTRACT(YEAR FROM CURRENT_DATE)::INT * 12 + EXTRACT(MONTH FROM CURRENT_DATE)::INT
    - (
      SELECT COALESCE(MAX(c2.periode_annee * 12 + c2.periode_mois), 
             EXTRACT(YEAR FROM m.date_adhesion)::INT * 12 + EXTRACT(MONTH FROM m.date_adhesion)::INT - 1)
      FROM cotisations c2
      WHERE c2.membre_id = m.id AND c2.statut = 'payé' AND c2.type_cotisation = 'mensuelle'
    )
  ) AS mois_retard
FROM membres m
LEFT JOIN sections s ON s.id = m.section_id
LEFT JOIN regions r ON r.id = m.region_id
WHERE m.statut = 'actif';

-- ============================================================
-- DONNÉES INITIALES
-- ============================================================

INSERT INTO organisations (id, nom, sigle, pays, devise)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Union Nationale des Travailleurs',
  'UNT',
  'Sénégal',
  'FCFA'
);

-- Super Admin par défaut (password: Admin@2025)
INSERT INTO utilisateurs (organisation_id, email, password_hash, nom, prenom, role)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@unionmanager.africa',
  crypt('Admin@2025', gen_salt('bf', 12)),
  'Admin',
  'Système',
  'super_admin'
);

-- ============================================================
-- INDEXES SUPPLÉMENTAIRES POUR PERFORMANCES
-- ============================================================
CREATE INDEX idx_cotisations_org_periode ON cotisations(organisation_id, periode_annee, periode_mois);
CREATE INDEX idx_membres_org_statut ON membres(organisation_id, statut);
CREATE INDEX idx_transactions_org_date ON transactions_financieres(organisation_id, date_transaction DESC);
