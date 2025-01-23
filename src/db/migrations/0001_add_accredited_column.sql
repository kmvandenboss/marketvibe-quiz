-- Migration: Add is_accredited column and set random values
DO $$ 
BEGIN
    -- Add the column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'is_accredited'
    ) THEN
        ALTER TABLE leads ADD COLUMN is_accredited BOOLEAN NOT NULL DEFAULT false;
        RAISE NOTICE 'Column is_accredited added successfully';
    ELSE
        RAISE NOTICE 'Column is_accredited already exists';
    END IF;

    -- Update existing records randomly
    UPDATE leads 
    SET is_accredited = true 
    WHERE random() < 0.3;
    
    RAISE NOTICE 'Random values set for is_accredited';
END $$;

-- Verify the column exists
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'is_accredited'
    ) THEN
        RAISE EXCEPTION 'Column is_accredited was not created successfully';
    END IF;
END $$;