CREATE TABLE profile
(
    id                        SERIAL PRIMARY KEY,
    user_id                    integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name                TEXT    NOT NULL,
    last_name                 TEXT    NOT NULL,
    branch_or_agency          TEXT,
    component                 TEXT,
    grade                     TEXT,
    basic_active_service_date DATE,
    date_of_birth             DATE,
    target_retirement_year     INTEGER,
    marital_status            TEXT,
    count_of_dependents       INTEGER,
    location                  TEXT,
    created_at                TIMESTAMP,
    updated_at                TIMESTAMP
);