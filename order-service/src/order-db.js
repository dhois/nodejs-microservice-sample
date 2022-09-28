const {PostgresDb} = require('core-lib');

module.exports = class OrderDb extends PostgresDb {
    constructor(config) {
        super(config);
        this.readOrdersQuery = `SELECT * FROM CustomOrder WHERE username = $1`;
        this.readOrderItemsQuery = `SELECT * FROM CustomOrderItem WHERE "customOrderId" = $1`;
        this.insertOrderItemQuery = `INSERT INTO CustomOrderItem (username, "catalogItemUid", "catalogItemName", quantity, "unitPrice", "customOrderId")
                                      VALUES ($1, $2, $3, $4, $5, $6)`;
        this.insertOrderQuery = `INSERT INTO CustomOrder (username, "orderDate", "shippingAddress", "billingAddress", "creditCard", "expiryDate", "totalPrice")
                                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    }

    async readOrders(username) {
        const query = {
            text: this.readOrdersQuery,
            values: [username]
        };
        return await this.query(query);
    }

    async readOrderItems(orderId) {
        const query = {
            text: this.readOrderItemsQuery,
            values: [orderId]
        };
        return await this.query(query);
    }

    async insertOrderItem(client, username, catalogItemUid, catalogItemName, quantity, unitPrice, customOrderId) {
        const query = {
            text: this.insertOrderItemQuery,
            values: [username, catalogItemUid, catalogItemName, quantity, unitPrice, customOrderId]
        };
        await client.query(query);
    }

    async insertOrder(client, username, orderDate, shippingAddress, billingAddress, creditCard, expiryDate, totalPrice) {
        const query = {
            text: this.insertOrderQuery,
            values: [username, orderDate, shippingAddress, billingAddress, creditCard, expiryDate, totalPrice]
        };
        return (await client.query(query)).rows[0].id;
    }
}
