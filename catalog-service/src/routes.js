const routes = require('express').Router()
    , {readCatalogItem, reduceAvailableStock, ReduceAvailableStockErrors} = require('./catalog-service')
    , logger = require('./config').logger;

const asyncHandler = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next))
        .catch(next)
}

routes.get('/catalog/:uid', asyncHandler(async (req, res, next) => {
    try {
        const result = await readCatalogItem(req.app.get('db'), req.params.uid);
        res.json(result);
        next();
    } catch (err) {
        logger.error(err.message);
        res.status(500).send(err.message);
        next(err);
    }
}));

routes.post('/catalog', asyncHandler(async (req, res, next) => {
    if (req.query.op === 'reduceStock') {
        try {
            logger.info(`Incoming request for reduceStock ${JSON.stringify(req.body)}`)
    
            const result = await reduceAvailableStock(req.app.get('db'), req.body);
            if (result.has(ReduceAvailableStockErrors.ItemOutOfStock)) {
                res.status(400).json({error: 'One or more items are out of stock.'});
            } else {
                res.json(result);
            }
            next();
        } catch (err) {
            logger.error(err.message);
    
            if (err.message === 'sorry, too many clients already')
                res.status(503).json({error: 'Could not process request due to overload. Please try again later.'});
            else
                res.status(500).json({error: 'Something went wrong'});
    
            next(err);
        }
    } else {
        res.status(501).json({error: 'Wrong operation'});
        next();
    }
}));

module.exports = routes;
