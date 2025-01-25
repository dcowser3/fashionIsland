CREATE DATABASE clothing_store;

\c clothing_store;

CREATE TABLE clothing_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO clothing_items (name, type, price, image_url) VALUES
    ('Classic T-Shirt', 'shirts', 29.99, 'https://via.placeholder.com/200'),
    ('Slim Fit Jeans', 'pants', 59.99, 'https://via.placeholder.com/200'),
    ('Summer Dress', 'dresses', 49.99, 'https://via.placeholder.com/200'),
    ('Leather Jacket', 'jackets', 99.99, 'https://via.placeholder.com/200'),
    ('Running Shoes', 'shoes', 79.99, 'https://via.placeholder.com/200'),
    ('Winter Coat', 'jackets', 129.99, 'https://via.placeholder.com/200'),
    ('Casual Shirt', 'shirts', 34.99, 'https://via.placeholder.com/200'),
    ('Yoga Pants', 'pants', 44.99, 'https://via.placeholder.com/200');