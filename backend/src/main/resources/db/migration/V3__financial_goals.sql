CREATE TABLE financialGoal
(
    id             SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title          TEXT,
    description    TEXT,
    goal_type      TEXT,
    current_amount NUMERIC(12, 2),
    target_amount  NUMERIC(12, 2),
    unit           TEXT,
    target_date    DATE,
    status         TEXT,
    created_at     TIMESTAMP,
    updated_at     TIMESTAMP
);