CREATE TABLE profile (
                         id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                         userId integer NOT NULL,
                         branch_or_agency text,
                         component text,
                         grade text,
                         years_of_service integer,
                         current_age integer,
                         target_retirement_age integer,
                         annual_income integer,
                         monthly_tsp_contribution integer,
                         monthly_other_contribution integer,
                         marital_status text,
                         count_of_dependents integer,
                         location text,
                         created_at timestamp,
                         updated_at timestamp
);