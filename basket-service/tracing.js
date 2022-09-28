const config = require('./src/config.js')
    , opentelemetry = require("@opentelemetry/sdk-node")
    , Resource = require("@opentelemetry/resources").Resource
    , SemanticResourceAttributes = require("@opentelemetry/semantic-conventions").SemanticResourceAttributes
    , { diag, DiagConsoleLogger, DiagLogLevel } = require('@opentelemetry/api')
    , { OTLPTraceExporter } = require("@opentelemetry/exporter-trace-otlp-http")
    , { PgInstrumentation } = require("@opentelemetry/instrumentation-pg")
    , { HttpInstrumentation } = require("@opentelemetry/instrumentation-http")
    , { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");

function initTracing(serviceName, jaegerUrl) {
    // For troubleshooting, set the log level to DiagLogLevel.DEBUG
    diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

    const sdk = new opentelemetry.NodeSDK({
        //traceExporter: new opentelemetry.tracing.ConsoleSpanExporter(),
        traceExporter: new OTLPTraceExporter({
            url: jaegerUrl,
        }),
        resource: new Resource({
            [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
        }),
        instrumentations: [new HttpInstrumentation({
            ignoreIncomingPaths: [/\/health/, /\/metrics/],
        }), new ExpressInstrumentation(), new PgInstrumentation()]
    });

    sdk.start().then(() => {
        console.log("Tracing initialized");
    });
}

initTracing(config.serviceName, config.jaegerUrl);
