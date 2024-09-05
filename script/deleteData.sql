-- Disable foreign key checks to avoid constraint violations during deletion
SET FOREIGN_KEY_CHECKS = 0;

-- Delete data from dependent tables first
DELETE FROM order_deliveries;

DELETE FROM error_logs;

DELETE FROM order_payments;

DELETE FROM order_details;

DELETE FROM orders;

DELETE FROM product_stocks;

DELETE FROM bundle_products;

DELETE FROM products;

DELETE FROM categories;

DELETE FROM suppliers;

DELETE FROM notifications;

DELETE FROM audit_logs;

DELETE FROM refresh_tokens;

DELETE FROM deliveries;

DELETE FROM reorder_levels;

-- Reset AUTO_INCREMENT values
ALTER TABLE order_deliveries AUTO_INCREMENT = 1;

ALTER TABLE order_payments AUTO_INCREMENT = 1;

ALTER TABLE order_details AUTO_INCREMENT = 1;

ALTER TABLE orders AUTO_INCREMENT = 1;

ALTER TABLE product_stocks AUTO_INCREMENT = 1;

ALTER TABLE bundle_products AUTO_INCREMENT = 1;

ALTER TABLE products AUTO_INCREMENT = 1;

ALTER TABLE error_logs AUTO_INCREMENT = 1;

ALTER TABLE categories AUTO_INCREMENT = 1;

ALTER TABLE suppliers AUTO_INCREMENT = 1;

ALTER TABLE notifications AUTO_INCREMENT = 1;

ALTER TABLE audit_logs AUTO_INCREMENT = 1;

ALTER TABLE refresh_tokens AUTO_INCREMENT = 1;

ALTER TABLE deliveries AUTO_INCREMENT = 1;

ALTER TABLE reorder_levels AUTO_INCREMENT = 1;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;