CREATE TABLE promotion_timeline (
                                    id              SERIAL PRIMARY KEY,
                                    retirement_plan_id INTEGER NOT NULL REFERENCES retirement_plan(id) ON DELETE CASCADE,
                                    effective_year  INTEGER NOT NULL,
                                    rank            VARCHAR NOT NULL,
                                    component       VARCHAR  -- e.g. "Active Duty", "Reserve"
);