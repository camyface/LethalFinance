CREATE TABLE budget (
                        id SERIAL PRIMARY KEY UNIQUE NOT NULL,
                        userId integer NOT NULL,
                        title text,
                        month text,
                        year integer,
                        notes text,
                        created_at timestamp,
                        updated_at timestamp
);