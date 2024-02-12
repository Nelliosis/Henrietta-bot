const { createLogger, transports, format } = require('winston');
const LokiTransport = require('winston-loki');

export const logger = createLogger({
    transports: [new LokiTransport({
        host: 'http://localhost:3100',
        labels: { source: 'Henrietta' },
        json: true,
        format: format.json(),
        replaceTimestamp: true,
        onConnectionError: (err) => {
            console.error('Error connecting to Loki:', err);
        }
    }),
    new transports.Console({
        format: format.combine(format.simple(), format.colorize())
    })]

})