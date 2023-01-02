const axios = require('axios')
    , config = require('./config.js')
    , CircuitBreaker = require('opossum');

// configure circuit breaker
const circuitBreaker = new CircuitBreaker(callBasketService, config.networkCircuitBreaker);

async function callBasketService(username) {
    return axios.get(config.basketUrl + username);
}

module.exports = {
    circuitBreaker,

    // use circuit breaker to read basket items
    readBasketItems: async function(username) {
        const response = await circuitBreaker.fire(username);
        return response.data;
    }
};