module.exports = {
    readBasketItems: async function (db, username) {
        return db.readBasketItems(username);
    }
};
