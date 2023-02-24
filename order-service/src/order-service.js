const e = require("express");
const client = require('prom-client');
const logger = require('./config.js').logger;

const successfulOrderCounter = new client.Counter({name: 'successful_orders_total', help: 'successful_orders_help'});
const errorOrderCounter = new client.Counter({name: 'error_orders_total', help: 'error_orders_help'});

const PlacingOrderErrors = {
    shippingAddressRequired: "Shipping address is required",
    billingAddressRequired: "Billing address is required",
    creditCardRequired: "Credit card is required",
    expiryDateRequired: "Expiry date is required",
    catalogItemOutOfStock: "Not all items are in stock",
    emptyBasket: "Your basket is empty. Please add items to your basket before placing an order.",
    DatabaseConnectionLimitReached: 'Database connection limit reached',
    CouldNotConnectToServices: 'Could not connect to other services',
};

async function isOrderValid(orderInfo) {
    const errors = new Set();
    if (!orderInfo.shippingAddress) errors.add(PlacingOrderErrors.shippingAddressRequired);
    if (!orderInfo.billingAddress) errors.add(PlacingOrderErrors.billingAddressRequired);
    if (!orderInfo.creditCard) errors.add(PlacingOrderErrors.creditCardRequired);
    if (!orderInfo.expiryDate) errors.add(PlacingOrderErrors.expiryDateRequired);
    return [errors, errors.size === 0];
}

async function saveOrder(db, client, orderInfo, basketItems) {
    const orderId = await db.insertOrder(client, orderInfo.username, orderInfo.orderDate, orderInfo.shippingAddress, orderInfo.billingAddress, orderInfo.creditCard, orderInfo.expiryDate, orderInfo.totalPrice);

    for (const item of basketItems) {
        await db.insertOrderItem(client, orderInfo.username, item.catalogItemUid, item.catalogItemName, item.quantity, item.unitPrice, orderId);
    }

    return orderId;
}

module.exports = {
    PlacingOrderErrors,

    readOrders: async function (db, username) {
        let orders = await db.readOrders(username);
        orders = orders || [];

        for (const order of orders) {
            order.items = await db.readOrderItems(order.id);
        }

        return orders;
    },

    placeOrder: async function (db, readBasketItems, reduceAvailableStock, orderInfo) {
        const errors = new Set();

        // check if parameters are valid
        const [paramErrors, validInfo] = await isOrderValid(orderInfo);
        if (!validInfo) {
            errorOrderCounter.inc();
            return {errors: paramErrors};
        }

        let orderStatus = false;
        let basketItems = [];
        try {
            // query basket of user and check if it is empty
            basketItems = await readBasketItems(orderInfo.username);
            logger.info(`Read basket items for ${orderInfo.username}: ${JSON.stringify(basketItems)}`)
            if (basketItems.length <= 0) {
                errors.add(PlacingOrderErrors.emptyBasket);
                errorOrderCounter.inc();
                return {errors};
            }

            // place order and return error if one of the items are not available anymore
            const tmpBasketItems = [];
            basketItems.forEach((item) => tmpBasketItems.push({
                catalogItemUid: item.catalogItemUid,
                quantity: item.quantity
            }));
            logger.info(`Reducing available stock for ${orderInfo.username}`)

            orderStatus = await reduceAvailableStock(tmpBasketItems);
            logger.info(`AvailableStock reduced for ${orderInfo.username} and ${orderStatus}`)
        } catch (e) {
            errors.add(PlacingOrderErrors.CouldNotConnectToServices);
            errorOrderCounter.inc();
            return {errors}
        }

        let client  = await db.pool.connect();

        if (!client) {
            errors.add(PlacingOrderErrors.DatabaseConnectionLimitReached);
            errorOrderCounter.inc();
            return [errors, undefined];
        }

        try {
            await db.beginTransaction(client);

            let orderId = -1;
            if (orderStatus) {
                orderId = await saveOrder(db, client, orderInfo, basketItems);
                logger.info(`Order ${orderId} saved for ${orderInfo.username}`);
                successfulOrderCounter.inc();
            } else {
                errors.add(PlacingOrderErrors.catalogItemOutOfStock);
                errorOrderCounter.inc();
            }

            await db.endTransaction(client);

            return {errors, orderId};
        } catch (error) {
            await db.rollback(client);
            logger.error('Error placing Order: ' + error);
        } finally {
            await client.release();
        }
    }
}