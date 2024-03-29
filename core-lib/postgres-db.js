const pg = require('pg');

module.exports = class PostgresDb {
    constructor(config) {
        this.config = config;
        this.pool = new pg.Pool(this.config.db);
        this.logger = config.logger;
    }

    async init() {
        this.pool.on('connect', (client) => this.logger.info('New Client-Connection to postgres database'));
        this.pool.on('error', (err) => this.logger.error('Could not connect to database, err: ', err));
    }

    async connect() {
        try {
            const client = await this.pool.connect();
            client.on('error', (err) => this.logger.error('Could not connect to database, err: ', err));
            return client;
        } catch (error) {
            this.logger.error('Could not connect to database', error);
        }
    }

    async checkHealth() {
        const res = await this.pool.query('SELECT $1::text as status', ['ACK']);
        if (res.rows[0].status === 'ACK') {
            return Promise.resolve();
        }
    }

    async query(query, inputs = undefined) {
        const result = await this.pool.query(query, inputs);
        return result.rows;
    }

    async beginTransaction(client) {
        await client.query('BEGIN');
    }

    async endTransaction(client) {
        await client.query('COMMIT');
    }

    async rollback(client) {
        await client.query('ROLLBACK');
    }

    async close() {
        try {
            await this.pool.end();
            this.logger.info('Database connection ended');
        } catch (error) {
            this.logger.error('Error closing connection', error);
        }
    }
}
