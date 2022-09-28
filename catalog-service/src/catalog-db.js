const {PostgresDb} = require('core-lib');

module.exports = class CatalogDb extends PostgresDb {
    constructor(config) {
        super(config);
        this.readCatalogItemQuery = `SELECT * FROM CatalogItem WHERE uid = $1`;
        this.reduceCatalogItemStockQuery = `UPDATE CatalogItem SET "availableStock" = "availableStock" + $1 WHERE uid = $2`;
    }

    async readCatalogItem(uid) {
        const query = {
            text: this.readCatalogItemQuery,
            values: [uid]
        };
        return await this.query(query);
    }

    async updateCatalogItemStock(client, quantity, uid) {
        const query = {
            text: this.reduceCatalogItemStockQuery,
            values: [quantity, uid]
        };
        await client.query(query);
    }
}
