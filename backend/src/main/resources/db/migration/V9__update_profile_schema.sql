ALTER TABLE profile
    ADD COLUMN IF NOT EXISTS first_name TEXT,
    ADD COLUMN IF NOT EXISTS last_name TEXT,
    ADD COLUMN IF NOT EXISTS date_of_birth DATE,
    ADD COLUMN IF NOT EXISTS service_entry_date DATE,
    ADD COLUMN IF NOT EXISTS target_retirement_year INTEGER,
    DROP COLUMN IF EXISTS years_of_service,
    DROP COLUMN IF EXISTS current_age,
    DROP COLUMN IF EXISTS annual_income,
    DROP COLUMN IF EXISTS monthly_tsp_contribution,
    DROP COLUMN IF EXISTS monthly_other_contribution,
    DROP COLUMN IF EXISTS target_retirement_age;