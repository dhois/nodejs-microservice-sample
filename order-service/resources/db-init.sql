CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE CustomOrder
(
    id                SERIAL PRIMARY KEY,
    uid               uuid DEFAULT uuid_generate_v4(),
    username          VARCHAR(255)   NOT NULL,
    "orderDate"       TIMESTAMP      NOT NULL,
    "shippingAddress" VARCHAR(255)   NOT NULL,
    "billingAddress"  VARCHAR(255)   NOT NULL,
    "creditCard"      VARCHAR(255)   NOT NULL,
    "expiryDate"      VARCHAR(255)   NOT NULL,
    "totalPrice"      NUMERIC(10, 2) NOT NULL
);

CREATE TABLE CustomOrderItem
(
    id                SERIAL PRIMARY KEY,
    uid               uuid DEFAULT uuid_generate_v4(),
    username          VARCHAR(255)   NOT NULL,
    "catalogItemUid"  VARCHAR(255)   NOT NULL,
    "catalogItemName" VARCHAR(255)   NOT NULL,
    quantity          INTEGER        NOT NULL,
    "unitPrice"       NUMERIC(10, 2) NOT NULL,
    "customOrderId"   INTEGER        NOT NULL REFERENCES CustomOrder (id)
);

ANALYSE CustomOrder;
ANALYSE CustomOrderItem;
