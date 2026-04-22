CREATE TABLE budgetItem (
                            id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                            budgetId integer NOT NULL,
                            name text,
                            category text,
                            planned_amount integer,
                            actual_amount integer,
                            is_recurring integer,
                            notes text,
                            created_at timestamp,
                            updated_at timestamp
);
