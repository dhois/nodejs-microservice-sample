const logger = require('./config.js').logger;

const ReduceAvailableStockErrors = {
    DatabaseConnectionLimitReached: 'Database connection limit reached',
    ItemOutOfStock: 'Item out of stock',
}

module.exports = {
    ReduceAvailableStockErrors,

    readCatalogItem: async function (db, uid) {
        return db.readCatalogItem(uid);
    },

    reduceAvailableStock: async function (db, items) {
        let errors = new Set();

        let client = await db.pool.connect();

        if (!client) {
            errors.add(ReduceAvailableStockErrors.DatabaseConnectionLimitReached);
            return errors;
        }

        try {
            await db.beginTransaction(client);

            for (const item of items) {
                logger.info(`Reducing quantity by ${item.quantity} for ${item.catalogItemUid}`)
                await db.updateCatalogItemStock(client, -item.quantity, item.catalogItemUid);
            }

            await db.endTransaction(client);
        } catch (error) {
            await db.rollback(client);
            logger.error('Error reducing available stock: ' + error.message);
            errors.add(ReduceAvailableStockErrors.ItemOutOfStock);
            return errors;
        } finally {
            await client.release();
        }

        return errors;
    }
}