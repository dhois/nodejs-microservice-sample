const {BaseServer} = require('core-lib')
    , OrderDb = require('./src/order-db.js')
    , config = require('./src/config')
    , routes = require('./src/routes.js')
    , basketService = require('./src/basket-service.js')
    , catalogService = require('./src/catalog-service.js')
    , PrometheusMetrics = require('opossum-prometheus')
    , { register } = require('prom-client');

class Server extends BaseServer {
    constructor(config) {
        super(config, new OrderDb(config));
    }

    async setup() {
        await super.setup();
        this.app.use(routes);

        // setup metrics for our basket and catalog circuit breakers
        const metrics = new PrometheusMetrics({ registry: register });
        metrics.add(basketService.circuitBreaker);
        metrics.add(catalogService.circuitBreaker);
    }
}

const server = new Server(config);
server.setup().then(() => server.start());

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});
