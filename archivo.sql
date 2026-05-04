CREATE DATABASE ecommerce;
USE ecommerce;

-- Tabla products
CREATE TABLE products (
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

-- Tabla options
CREATE TABLE options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    option_name VARCHAR(100)
);

-- Tabla product_options (relación muchos a muchos)
CREATE TABLE product_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    option_id INT,
    product_id INT,
    FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Tabla categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    thumbnail VARCHAR(255)
);

-- Tabla product_categories (relación muchos a muchos)
CREATE TABLE product_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    category_id INT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabla customers
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150),
    password VARCHAR(255),
    full_name VARCHAR(150),
    billing_address TEXT,
    default_shipping_address TEXT,
    country VARCHAR(100),
    phone VARCHAR(50)
);

-- Tabla orders
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    amount DECIMAL(10,2),
    shipping_address TEXT,
    order_address TEXT,
    order_email VARCHAR(150),
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(50),
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
);

-- Tabla order_details
CREATE TABLE order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    price DECIMAL(10,2),
    sku VARCHAR(50),
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);