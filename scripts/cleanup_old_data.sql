-- Begin transaction to ensure data consistency
BEGIN;

-- First, delete old analytics events
DELETE FROM analytics_events
WHERE timestamp < '2025-02-12 05:08:16+00';

-- Then, delete old leads
-- Note: This will also cascade to related analytics_events due to foreign key relationship
DELETE FROM leads
WHERE created_at < '2025-02-12 05:09:31+00';

-- Verify the deletion counts (optional, comment out in production)
SELECT 'Remaining analytics_events' as table_name, COUNT(*) as record_count 
FROM analytics_events 
WHERE timestamp >= '2025-02-12 05:08:16+00';

SELECT 'Remaining leads' as table_name, COUNT(*) as record_count 
FROM leads 
WHERE created_at >= '2025-02-12 05:09:31+00';

-- Commit the transaction
COMMIT;