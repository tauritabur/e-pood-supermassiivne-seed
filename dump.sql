CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    cust_name VARCHAR(80) NOT NULL,
    email VARCHAR(120) NOT NULL,
    shipping_address TEXT NOT NULL
);

CREATE TABLE products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(120) NOT NULL,
    product_description TEXT,
    product_rate DECIMAL(10,2)
);

CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(customer_id),
    order_status VARCHAR(20) NOT NULL,
    delivery_date DATE NOT NULL
);

CREATE TABLE order_items (
    orderitem_id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(order_id),
    product_id INT NOT NULL REFERENCES products(product_id),
    total_amount DECIMAL(10,2),
    shipping_date DATE NOT NULL
);
