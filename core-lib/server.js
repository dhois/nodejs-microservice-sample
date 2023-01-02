const http = require('http')
    , express = require('express')
    , bodyParser = require('body-parser')
    , { collectDefaultMetrics, register } = require('prom-client')
    , express_prom_bundle = require('express-prom-bundle')
    , { createTerminus } = require('@godaddy/terminus');

module.exports = class BaseServer {
    constructor(config, db) {
        this.config = config;
        this.app = express();
        this.db = db;
        this.logger = config.logger;
    }

    async setup() {
        await this.db.init();
        this.app.use(bodyParser.json());
        this.app.use(express_prom_bundle(this.config.metrics));
        /*collectDefaultMetrics({
            app: 'shop_app',
            prefix: 'shop_app_',
            timeout: 10000,
            register
        });*/

        this.server = http.createServer(this.app);
        createTerminus(this.server, {
            signal: 'SIGINT',
            healthChecks: {'/health': () => this.onHealthCheck()},
            onSignal: this.onCleanUp,
        });

        this.app.set('db', this.db);
        this.app.set('logger', this.logger);
    }

    async start() {
        this.server.listen(this.config.server.port, () => this.logger.info(`${this.config.serviceName} is listening on ${this.config.server.port}!`));
    }

    async onHealthCheck() {
        return Promise.all([this.db.checkHealth()]);
    }

    async onCleanUp() {
        await this.db.close();
    }
}
