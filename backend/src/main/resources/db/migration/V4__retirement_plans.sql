CREATE TABLE retirementPlan
(
    id                            SERIAL PRIMARY KEY,
    user_id                       INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    title                         TEXT,
    description                   TEXT,
    current_rank                  VARCHAR,
    target_retirement_year        INTEGER,
    retirement_type               TEXT,
    monthly_other_contribution    NUMERIC(12, 2),
    tsp_contribution_percent      NUMERIC(5, 2),
    expected_annual_raise_percent NUMERIC(5, 2),
    retirement_income_goal        NUMERIC(12, 2),
    assumed_return_rate           NUMERIC(5, 2),
    notes                         TEXT,
    created_at                    TIMESTAMP,
    updated_at                    TIMESTAMP

);