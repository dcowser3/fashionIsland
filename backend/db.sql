CREATE DATABASE clothing_store;

\c clothing_store;

CREATE TABLE clothing_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    subtype VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    source VARCHAR(50) DEFAULT 'manual' NOT NULL,
    cached_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, source)
);

-- Insert some sample data
INSERT INTO clothing_items (name, type, price, image_url) VALUES
    ('Classic T-Shirt', 'shirts', 29.99, 'https://via.placeholder.com/200'),
    ('Slim Fit Jeans', 'bottoms', 59.99, 'https://via.placeholder.com/200', 'manual', NULL, NULL, 'jeans'),
    ('Summer Dress', 'dresses', 49.99, 'https://via.placeholder.com/200'),
    ('Leather Jacket', 'jackets', 99.99, 'https://via.placeholder.com/200'),
    ('Running Shoes', 'shoes', 79.99, 'https://via.placeholder.com/200'),
    ('Winter Coat', 'jackets', 129.99, 'https://via.placeholder.com/200'),
    ('Casual Shirt', 'shirts', 34.99, 'https://via.placeholder.com/200'),
    ('Yoga Pants', 'bottoms', 44.99, 'https://via.placeholder.com/200', 'manual', NULL, NULL, 'jeans');

-- Add some sample bottom subtypes
INSERT INTO clothing_items (name, type, subtype, price, image_url) VALUES
    ('Summer Shorts', 'bottoms', 'shorts', 39.99, 'https://via.placeholder.com/200'),
    ('Pleated Skirt', 'bottoms', 'skirts', 49.99, 'https://via.placeholder.com/200');
