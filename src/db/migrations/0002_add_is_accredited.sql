DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'leads' AND column_name = 'is_accredited'
    ) THEN
        ALTER TABLE "leads" ADD COLUMN "is_accredited" boolean NOT NULL DEFAULT false;
    END IF;
END $$;