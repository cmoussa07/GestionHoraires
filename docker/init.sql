CREATE DATABASE IF NOT EXISTS gestion_horaires;
USE gestion_horaires;

CREATE TABLE IF NOT EXISTS roles (
  idrole INT PRIMARY KEY AUTO_INCREMENT,
  libelle VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS grades (
  idgrade INT PRIMARY KEY AUTO_INCREMENT,
  libelle VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS departements (
  iddepartement INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS enseignants (
  idenseignant INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  tel VARCHAR(20),
  grade_id INT,
  departement_id INT,
  statut ENUM('Permanent', 'Vacataire') DEFAULT 'Permanent',
  taux_horaire FLOAT DEFAULT 0,
  heures_contractuelles FLOAT DEFAULT 0,
  actif TINYINT DEFAULT 1,
  FOREIGN KEY (grade_id) REFERENCES grades(idgrade),
  FOREIGN KEY (departement_id) REFERENCES departements(iddepartement)
);

CREATE TABLE IF NOT EXISTS utilisateurs (
  iduti INT PRIMARY KEY AUTO_INCREMENT,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  mdp VARCHAR(255) NOT NULL,
  role_id INT,
  enseignant_id INT,
  actif TINYINT DEFAULT 1,
  FOREIGN KEY (role_id) REFERENCES roles(idrole),
  FOREIGN KEY (enseignant_id) REFERENCES enseignants(idenseignant)
);

CREATE TABLE IF NOT EXISTS matieres (
  idmatiere INT PRIMARY KEY AUTO_INCREMENT,
  intitule VARCHAR(150) NOT NULL,
  filiere VARCHAR(100) NOT NULL,
  niveau ENUM('L1', 'L2', 'L3', 'M1', 'M2') NOT NULL,
  volume_horaireprevu FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS annees_academiques (
  idannee INT PRIMARY KEY AUTO_INCREMENT,
  libelle VARCHAR(50) NOT NULL,
  date_debut DATE NOT NULL,
  date_fin DATE NOT NULL,
  active TINYINT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS heures_effectuees (
  idheure INT PRIMARY KEY AUTO_INCREMENT,
  enseignant_id INT NOT NULL,
  matiere_id INT NOT NULL,
  date_cours DATE NOT NULL,
  type_heure ENUM('CM', 'TD', 'TP') NOT NULL,
  duree FLOAT NOT NULL,
  salle VARCHAR(50),
  observations TEXT,
  est_complementaire TINYINT DEFAULT 0,
  statut ENUM('en attente','validé','refusé') DEFAULT 'en attente',
  annee_id INT,
  FOREIGN KEY (enseignant_id) REFERENCES enseignants(idenseignant),
  FOREIGN KEY (matiere_id) REFERENCES matieres(idmatiere),
  FOREIGN KEY (annee_id) REFERENCES annees_academiques(idannee)
);

CREATE TABLE IF NOT EXISTS parametres (
  idparametre INT PRIMARY KEY AUTO_INCREMENT,
  annee_id INT,
  equivalent_cm FLOAT DEFAULT 1,
  equivalent_td FLOAT DEFAULT 1.5,
  equivalent_tp FLOAT DEFAULT 2,
  taux_permanent FLOAT DEFAULT 6000,
  taux_vacataire FLOAT DEFAULT 3000,
  FOREIGN KEY (annee_id) REFERENCES annees_academiques(idannee)
);

CREATE TABLE IF NOT EXISTS logs (
  idlog INT PRIMARY KEY AUTO_INCREMENT,
  utilisateur_id INT,
  action VARCHAR(255) NOT NULL,
  table_concernee VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(iduti)
);


-- Données de base
INSERT INTO roles (libelle) VALUES ('admin'), ('rh'), ('enseignant');
INSERT INTO grades (libelle) VALUES ('Assistant'), ('Maître-Assistant'), ('Professeur'), ('Autres');
INSERT INTO annees_academiques (libelle, date_debut, date_fin, active)
VALUES ('2025-2026', '2025-09-01', '2026-07-31', 1);

INSERT INTO parametres (annee_id, equivalent_cm, equivalent_td, equivalent_tp, taux_permanent, taux_vacataire)
SELECT idannee, 1, 1.5, 2, 6000, 3000
FROM annees_academiques
WHERE libelle = '2025-2026';