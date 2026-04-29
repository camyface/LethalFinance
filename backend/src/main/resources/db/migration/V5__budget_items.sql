CREATE TABLE budgetItem
(
    id             SERIAL PRIMARY KEY,
    budget_id      INTEGER NOT NULL REFERENCES budget(id) ON DELETE CASCADE,
    name           TEXT,
    category       TEXT,
    planned_amount NUMERIC(12, 2),
    actual_amount  NUMERIC(12, 2),
    is_recurring   BOOLEAN DEFAULT FALSE,
    notes          TEXT,
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP
);
