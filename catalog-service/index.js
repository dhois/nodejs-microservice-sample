const {BaseServer} = require('core-lib')
    , CatalogDb = require('./src/catalog-db.js')
    , config = require('./src/config')
    , routes = require('./src/routes.js')

class Server extends BaseServer {
    constructor(config) {
        super(config, new CatalogDb(config));
    }

    async setup() {
        await super.setup();
        this.app.use(routes);
    }
}

const server = new Server(config);
server.setup().then(() => server.start());
