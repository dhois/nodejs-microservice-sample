const {createLogger, format, transports} = require("winston")
    , os = require("os");

const serverPort = process.env.SERVER_PORT || 50300;

module.exports = {
    serviceName: "order-service",
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_DATABASE || 5432,
        database: process.env.DB_DATABASE || 'shop-db',
        user: process.env.DB_USER || 'docker',
        password: process.env.DB_PASSWORD || 'docker',
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 5000,
        max: 100
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
        defaultMeta: {serviceName: 'order-service', containerId: os.hostname()},
        transports: [
            new transports.File({filename: 'logs/order.log', level: 'info'}),
            new transports.Console({level: 'debug'})
        ]
    }),
    metrics: {
        includeMethod: true,
        includePath: true,
        normalizePath: [["/order/.*", "/order/#username"]]
    },
    jaegerUrl: process.env.JAEGER_URL || "http://localhost:4318/v1/traces",
    basketUrl: process.env.BASKET_URL || 'http://localhost:50100/basket/',
    catalogUrl: process.env.CATALOG_URL || 'http://localhost:50200/catalog/',
    networkCircuitBreaker: {
        timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
        errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
        resetTimeout: 30000 // After 30 seconds, try again.
    }
};