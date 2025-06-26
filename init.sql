CREATE DATABASE mydatabase;

\connect mydatabase;

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
