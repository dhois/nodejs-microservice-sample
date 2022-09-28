const routes = require('express').Router()
    , basketService = require('./basket-service.js')
    , logger = require('./config').logger

const asyncHandler = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next))
        .catch(next)
}

routes.get('/basket/:username', asyncHandler(async (req, res, next) => {
    try {
        const result = await basketService.readBasketItems(req.app.get('db'), req.params.username);
        logger.info(`Reading basket items for ${req.params.username}: ${JSON.stringify(result)}`);
        res.json(result);
        next();
    } catch (err) {
        logger.error(err.message);
        res.status(500).send(err.message);
        next(err);
    }
}));

module.exports = routes;