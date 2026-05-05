CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50),
    name VARCHAR(255),
    price DECIMAL(10,2),
    weight DECIMAL(10,2),
    descriptions TEXT,
    thumbnail VARCHAR(255),
    image VARCHAR(255),
    category VARCHAR(100),
    create_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    stock INT
);

CREATE TABLE IF NOT EXISTS options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    option_name VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    thumbnail VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NULL,
    password VARCHAR(255) NULL,
    full_name VARCHAR(150) NULL,
    username VARCHAR(50) NULL UNIQUE,
    role ENUM('USER','DEVELOPER','ADMIN') NOT NULL DEFAULT 'USER',
    billing_address TEXT NULL,
    default_shipping_address TEXT NULL,
    country VARCHAR(100) NULL,
    phone VARCHAR(50) NULL
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NULL,
    amount DECIMAL(10,2),
    shipping_address TEXT,
    order_address TEXT,
    order_email VARCHAR(150),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(50),
    CONSTRAINT fk_orders_customer
      FOREIGN KEY (customer_id) REFERENCES customers(id)
      ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS product_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    option_id INT,
    product_id INT,
    CONSTRAINT fk_product_options_option
      FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_options_product
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    category_id INT,
    CONSTRAINT fk_product_categories_product
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    CONSTRAINT fk_product_categories_category
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT NULL,
    price DECIMAL(10,2),
    sku VARCHAR(50),
    quantity INT,
    CONSTRAINT fk_order_details_order
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    CONSTRAINT fk_order_details_product
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);