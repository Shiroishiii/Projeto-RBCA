-- Execute no banco configurado em DB_NAME antes de usar o cadastro.
-- Não cria contas prontas e não apaga uma tabela que já exista.
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user'
);

-- Se a tabela já existir, confira sua estrutura com SHOW CREATE TABLE users.
-- Ela precisa dos campos acima e de uma restrição UNIQUE para email.
