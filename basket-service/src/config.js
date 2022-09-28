const {createLogger, format, transports} = require("winston")
    , os = require("os");

const serverPort = process.env.SERVER_PORT || 50100;

module.exports = {
    serviceName: 'basket-service',
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_DATABASE || 5432,
        database: process.env.DB_DATABASE || 'shop-db',
        user: process.env.DB_USER || 'docker',
        password: process.env.DB_PASSWORD || 'docker',
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 5000,
        max: 1
    },
    server: {
        port: serverPort
    },
    logger: createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp(),
            format.json()
        ),
        defaultMeta: {serviceName: 'basket-service', containerId: os.hostname()},
        transports: [
            new transports.File({filename: 'logs/basket.log', level: 'info'}),
            new transports.Console({level: 'debug'})
        ]
    }),
    metrics: {
        includeMethod: true,
        includePath: true,
        normalizePath: [['/basket/.*', '/basket/#username']]
    },
    jaegerUrl: process.env.JAEGER_URL || "http://localhost:4318/v1/traces"
};