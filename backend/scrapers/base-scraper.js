const puppeteer = require('puppeteer');
const Redis = require('redis');
const { promisify } = require('util');

class BaseScraper {
    constructor(siteConfig, siteName) {
        this.config = siteConfig;
        this.siteName = siteName;
        this.redisClient = Redis.createClient();
        this.getAsync = promisify(this.redisClient.get).bind(this.redisClient);
        this.setAsync = promisify(this.redisClient.set).bind(this.redisClient);
        this.delAsync = promisify(this.redisClient.del).bind(this.redisClient);

        this.redisClient.on('error', (err) => console.log('Redis Client Error', err));
    }

    async scrapeCategory(type) {
        const cacheKey = `${this.siteName}:${type}`;
        const cachedData = await this.getAsync(cacheKey);

        if (cachedData) {
            return JSON.parse(cachedData);
        }

        if (!this.config.categoryUrls[type]) {
            throw new Error(`Unsupported category: ${type} for site: ${this.siteName}`);
        }

        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        try {
            const page = await browser.newPage();
            await page.goto(this.config.baseUrl + this.config.categoryUrls[type], {
                waitUntil: 'networkidle0'
            });

            await page.waitForSelector(this.config.selectors.productGrid);

            const products = await page.evaluate((selectors) => {
                const items = [];
                const productCards = document.querySelectorAll(selectors.productCard);

                productCards.forEach(card => {
                    const nameElement = card.querySelector(selectors.name);
                    const priceElement = card.querySelector(selectors.price);
                    const imageElement = card.querySelector(selectors.image);

                    if (nameElement && priceElement && imageElement) {
                        const priceText = priceElement.textContent.trim();
                        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

                        items.push({
                            name: nameElement.textContent.trim(),
                            price: price,
                            image_url: imageElement.src,
                            type: window.location.pathname.split('/').pop(),
                            source: document.location.hostname
                        });
                    }
                });

                return items;
            }, this.config.selectors);

            await this.setAsync(cacheKey, JSON.stringify(products), 'EX', 24 * 60 * 60);

            return products;
        } catch (error) {
            console.error(`Scraping error for ${this.siteName}:`, error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    async clearCache(type) {
        const cacheKey = `${this.siteName}:${type}`;
        await this.delAsync(cacheKey);
    }

    getAvailableCategories() {
        return Object.keys(this.config.categoryUrls);
    }
}

module.exports = BaseScraper;
