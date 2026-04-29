CREATE TABLE users (
                       id SERIAL PRIMARY KEY,
                       email VARCHAR NOT NULL UNIQUE,
                       password_hash VARCHAR NOT NULL,
                       role TEXT NOT NULL DEFAULT 'USER',
                       created_at TIMESTAMP,
                       updated_at TIMESTAMP

);