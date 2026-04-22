CREATE TABLE retirementPlan (
                                id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                                userId integer NOT NULL,
                                title text,
                                description text,
                                current_rank varchar,
                                target_retirement_year integer,
                                target_retirement_age integer,
                                retirement_type text,
                                estimated_high_3 integer,
                                monthly_pension_amount integer,
                                annual_pension_amount integer,
                                tsp_contribution_percent integer,
                                expected_annual_raise_percent integer,
                                retirement_income_goal integer,
                                assumed_return_rate integer,
                                notes text,
                                created_at timestamp,
                                updated_at timestamp

);