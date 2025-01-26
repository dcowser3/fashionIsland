const express = require('express');
const cors = require('cors');
const db = require('./db');
const { getScraper, getAvailableSites, getAvailableCategories } = require('./scrapers');

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

// Get clothing items by type and optional subtype
app.get('/api/clothing/:type', async (req, res) => {
    try {
        const { type } = req.params;
        const { subtype } = req.query;
        
        let query = 'SELECT * FROM clothing_items WHERE type = $1';
        let params = [type];
        
        if (type === 'bottoms' && subtype) {
            query += ' AND subtype = $2';
            params.push(subtype);
        }
        
        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get available subtypes for bottoms
app.get('/api/clothing/bottoms/subtypes', async (req, res) => {
    try {
        const result = await db.query(
            'SELECT DISTINCT subtype FROM clothing_items WHERE type = $1 AND subtype IS NOT NULL',
            ['bottoms']
        );
        res.json(result.rows.map(row => row.subtype));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new clothing item
app.post('/api/clothing', async (req, res) => {
    try {
        const { name, type, subtype, price, image_url } = req.body;
        const result = await db.query(
            'INSERT INTO clothing_items (name, type, subtype, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, type, subtype, price, image_url]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get available sites and their categories
app.get('/api/sites', (req, res) => {
    try {
        const sites = getAvailableSites();
        const siteCategories = {};
        
        for (const site of sites) {
            siteCategories[site] = getAvailableCategories(site);
        }
        
        res.json(siteCategories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get available sites' });
    }
});

// Scrape products from a specific site and category
app.get('/api/scrape/:site/:type', async (req, res) => {
    try {
        const { site, type } = req.params;
        const scraper = getScraper(site);
        const products = await scraper.scrapeCategory(type);
        
        // Store scraped items in database
        for (const product of products) {
            await db.query(
                'INSERT INTO clothing_items (name, type, subtype, price, image_url, source, cached_at) VALUES ($1, $2, $3, $4, $5, $6, NOW()) ON CONFLICT (name, source) DO UPDATE SET price = $4, image_url = $5, cached_at = NOW()',
                [product.name, product.type, product.subtype, product.price, product.image_url, site]
            );
        }

        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: `Failed to fetch data from ${req.params.site}` });
    }
});

// Force refresh cache for a site's category
app.post('/api/scrape/:site/:type/refresh', async (req, res) => {
    try {
        const { site, type } = req.params;
        const scraper = getScraper(site);
        await scraper.clearCache(type);
        res.json({ message: 'Cache cleared successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to clear cache' });
    }
});

// Get all clothing items from all sources for a category
app.get('/api/clothing/:type/all', async (req, res) => {
    try {
        const { type } = req.params;
        const result = await db.query(
            'SELECT * FROM clothing_items WHERE type = $1 ORDER BY price ASC',
            [type]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
