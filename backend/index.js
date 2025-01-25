const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Get all clothing items
app.get('/api/clothing', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM clothing_items');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get clothing items by type
app.get('/api/clothing/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const result = await db.query(
            'SELECT * FROM clothing_items WHERE type = $1',
            [type]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new clothing item
app.post('/api/clothing', async (req, res) => {
    try {
        const { name, type, price, image_url } = req.body;
        const result = await db.query(
            'INSERT INTO clothing_items (name, type, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, type, price, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});