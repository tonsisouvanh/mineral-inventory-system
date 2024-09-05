-- Active: 1722244340398@@127.0.0.1@3306@mineralstock
show tables;

show columns from users;

select * from users;

select * from notifications;

select *
from products p
    inner JOIN categories c on p.category_id = c.id;

-- insert into
--     notifications (
--         title,
--         message,
--         is_read,
--         created_at,
--         updated_at,
--         user_id
--     )
-- values (
--         'Title',
--         'Message',
--         false,
--         now(),
--         now(),
--         20
--     );

select * from refresh_tokens;

select * from users;

update users set remarks = 'somethdddding' where id = 6;

delete from users;

ALTER TABLE users AUTO_INCREMENT = 1;

select * from products;

select * from categories;

delete from products;

ALTER TABLE products AUTO_INCREMENT = 1;

delete from categories;

ALTER TABLE categories AUTO_INCREMENT = 1;

delete from product_stocks;

ALTER TABLE product_stocks AUTO_INCREMENT = 1;

use mineralstock;

insert into
    product_stocks (
        quantity,
        created_by,
        product_id
        -- , created_at
    )
VALUES (
        13,
        1,
        1
        -- , NOW()
    );

select * from users;

select * from products;

select * from product_stocks;

select * from orders;

select * from order_details;

delete from products;

ALTER TABLE products AUTO_INCREMENT = 1;

select * from products;

ALTER TABLE product_stocks AUTO_INCREMENT = 1;

select * from refresh_tokens;

insert into
    users (
        username,
        email,
        password,
        role,
        created_at,
        updated_at
    )
values (
        'useradmin',
        'admin@gmail.com',
        'admin',
        'ADMIN',
        now(),
        now()
    );

select * from products;

select * from product_stocks;

insert into
    reorder_levels (level_name, level_value)
values ('Low', 10);

insert into
    reorder_levels (level_name, level_value)
values ('normal', 20);

insert into
    reorder_levels (level_name, level_value)
values ('out_of_stock', 0);

select * from products WHERE code = 'normal_250ml_pack' and pack = 1;

select * from product_stocks;

select * from orders;

select * from order_details

delete from orders;

delete from product_stocks;

delete from order_details;

update products set reorder_level = 10, quantity = 100;

select * from products;

select * from products where active_at is not null;

select * from bundle_products;

DELETE from bundle_products;

ALTER Table bundle_products AUTO_INCREMENT = 1;

WHERE product_id = 15;

select p.name, bp.name
from
    products p
    inner join bundle_products bp on p.product_number = bp.product_id
WHERE
    p.pack = 1
    and p.active_at is not null;

select id, product_id from bundle_products;

select * from product_stocks;

select id, pack, active_at, product_number, quantity from products;

select p.id, p.name, p.code, p.size, p, pack, p.type
from
    products p
    inner join bundle_products bp on products.product_number = bundle_products.product_id
where
    p.product_number = 23;

select * from bundle_products;

select * from products;

select * from product_stocks;

select id, product_id, code from bundle_products;

select * from orders;

select * from order_details;

select * from products;

delete from orders;

delete from product_stocks;

ALTER TABLE orders AUTO_INCREMENT = 1;

select * from error_logs;

DELETE FROM error_logs;

ALTER TABLE error_logs AUTO_INCREMENT = 1;