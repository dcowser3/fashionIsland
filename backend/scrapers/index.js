const BaseScraper = require('./base-scraper');
const siteConfigs = require('./config');

// Create scraper instances for each site
const scrapers = {};

for (const [siteName, config] of Object.entries(siteConfigs)) {
    scrapers[siteName] = new BaseScraper(config, siteName);
}

function getAvailableSites() {
    return Object.keys(scrapers);
}

function getScraper(siteName) {
    const scraper = scrapers[siteName];
    if (!scraper) {
        throw new Error(`No scraper found for site: ${siteName}`);
    }
    return scraper;
}

function getAvailableCategories(siteName) {
    const scraper = getScraper(siteName);
    return scraper.getAvailableCategories();
}

module.exports = {
    scrapers,
    getAvailableSites,
    getScraper,
    getAvailableCategories
};
