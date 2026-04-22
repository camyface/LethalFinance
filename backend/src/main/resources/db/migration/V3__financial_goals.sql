CREATE TABLE financialGoal (
                               id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                               userId integer NOT NULL,
                               title text,
                               description text,
                               goal_type text,
                               current_amount integer,
                               target_amount integer,
                               unit text,
                               target_date date,
                               status text,
                               created_at timestamp,
                               updated_at timestamp
);