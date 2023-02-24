const axios = require('axios')
    , config = require('./config.js')
    , CircuitBreaker = require('opossum');

const circuitBreaker = new CircuitBreaker(reduceAvailableStockImpl, config.networkCircuitBreaker);

async function reduceAvailableStockImpl(catalogItems) {
    return axios({
        method: 'POST',
        url: config.catalogUrl + '?op=reduceStock',
        data: catalogItems
    });
}

module.exports = {
    circuitBreaker,

    reduceAvailableStock: async function (catalogItems) {
        const response = await circuitBreaker.fire(catalogItems);
        return response.data;
    }
};