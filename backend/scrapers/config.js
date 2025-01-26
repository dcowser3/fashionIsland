const siteConfigs = {
    princessPolly: {
        baseUrl: 'https://us.princesspolly.com',
        selectors: {
            productGrid: '.product-grid',
            productCard: '.product-card',
            name: '.product-card__title',
            price: '.product-card__price',
            image: '.product-card__image img'
        },
        categoryUrls: {
            pants: '/collections/pants',
            dresses: '/collections/dresses',
            tops: '/collections/tops',
            skirts: '/collections/skirts',
            jackets: '/collections/jackets'
        }
    },
    urbanOutfitters: {
        baseUrl: 'https://www.urbanoutfitters.com',
        selectors: {
            productGrid: '.c-product-grid',
            productCard: '.c-product-tile',
            name: '.c-product-tile__heading',
            price: '.c-product-tile__price-current',
            image: '.c-product-tile__image img'
        },
        categoryUrls: {
            pants: '/womens-clothing-bottoms',
            dresses: '/dresses',
            tops: '/womens-clothing-tops',
            jackets: '/womens-clothing-jackets-coats'
        }
    }
    // Add more sites here following the same structure
};

module.exports = siteConfigs;
