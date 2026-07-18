-- Adds damaged_in_transit / lost_in_transit / delivered_not_received /
-- delivery_refused to exceptions.type — research-driven addition,
-- 03-EXCEPTIONS-TAXONOMY.md §1.6-1.8, approved by Moses 2026-07-15
-- (05-LIVE-BUILD-LOG.md). Postgres has no ALTER on a column check
-- constraint in place, so drop + recreate with the expanded set.

alter table exceptions drop constraint exceptions_type_check;

alter table exceptions add constraint exceptions_type_check check (type in (
  'address_issue','failed_attempt','access_issue','carrier_delay','customs_hold',
  'damaged_in_transit','lost_in_transit','delivered_not_received','delivery_refused',
  'webhook_processing_failure','write_back_failure','no_response',
  'rto_in_progress','rto_completed'
));
