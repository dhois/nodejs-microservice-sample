const routes = require('express').Router()
    , { readOrders, placeOrder, PlacingOrderErrors } = require('./order-service')
    , basketService = require('./basket-service')
    , catalogService = require('./catalog-service')
    , logger = require('./config').logger;

const asyncHandler = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next))
        .catch(next)
}

routes.get('/order/:username', asyncHandler(async (req, res, next) => {
    try {
        const result = await readOrders(req.app.get('db'), req.params.username);
        res.json(result);
        next();
    } catch (err) {
        logger.error(`Error reading order for user ${req.params.username}: ${err.message}`);
        res.status(500).send(err.message);
        next(err);
    }
}));

routes.post('/order/:username', asyncHandler(async (req, res, next) => {
    try {
        const orderInfo = {
            username: req.params.username,
            orderDate: new Date(),
            shippingAddress: req.body.shippingAddress,
            billingAddress: req.body.billingAddress,
            creditCard: req.body.creditCard,
            expiryDate: req.body.expiryDate,
            totalPrice: req.body.totalPrice
        }

        const result = await placeOrder(req.app.get('db'), basketService.readBasketItems, catalogService.reduceAvailableStock, orderInfo);
        logger.info(`Placed order for user ${req.params.username}: ${JSON.stringify(result)}`);

        if (result.errors.has(PlacingOrderErrors.DatabaseConnectionLimitReached) ||
            result.errors.has(PlacingOrderErrors.CouldNotConnectToServices)) {
            res.status(503).json({ error: 'Could not place order due to overload. Please try again later.'});
        } else if (result.errors.size > 0)
            res.status(400).json({ errors: Array.from(result.errors) });
        else
            res.json({ orderId: result.orderId });
        next();
    } catch (err) {
        logger.error(`Error placing order for user ${req.params.username}: ${err.message}`);
        if (err.message === 'sorry, too many clients already')
            res.status(503).json({error: 'Could not process request due to overload. Please try again later.'});
        else
            res.status(500).json({error: 'Something went wrong'});
        next(err);
    }
}));

module.exports = routes;
