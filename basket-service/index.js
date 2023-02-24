const {BaseServer} = require('core-lib');
const BasketDb = require('./src/basket-db.js');
const config = require('./src/config.js');
const routes = require('./src/routes.js');

class Server extends BaseServer {
    constructor(config) {
        super(config, new BasketDb(config));
    }

    async setup() {
        await super.setup();
        this.app.use(routes);
    }
}

const server = new Server(config);
server.setup().then(() => server.start());

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});