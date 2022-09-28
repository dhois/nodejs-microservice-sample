const {PostgresDb} = require('core-lib');

module.exports = class BasketDb extends PostgresDb {
    constructor(config) {
        super(config);
        this.readBasketItemQuery = 'SELECT * FROM Basket WHERE username = $1';
    }

    async readBasketItems(username) {
        const query = {
            text: this.readBasketItemQuery,
            values: [username]
        };
        return await this.query(query);
    }
}
