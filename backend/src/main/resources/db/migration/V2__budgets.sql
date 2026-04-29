CREATE TABLE budget
(
    id         SERIAL PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title      TEXT,
    month      INTEGER CHECK (month BETWEEN 1 AND 12),
    year       INTEGER,
    notes      TEXT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);