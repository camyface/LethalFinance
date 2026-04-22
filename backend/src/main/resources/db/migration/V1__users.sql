CREATE TABLE users (
                       id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                       first_name text,
                       last_name text,
                       email varchar NOT NULL UNIQUE,
                       password_hash varchar UNIQUE,
                       role text,
                       created_at timestamp,
                       updated_at timestamp

);