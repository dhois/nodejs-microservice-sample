CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE Basket
(
    id                SERIAL PRIMARY KEY,
    username          VARCHAR(255)   NOT NULL,
    "catalogItemUid"  uuid           NOT NULL,
    "catalogItemName" VARCHAR(255)   NOT NULL,
    quantity          INTEGER        NOT NULL,
    "unitPrice"       NUMERIC(10, 2) NOT NULL
);

INSERT INTO Basket (username, "catalogItemUid", "catalogItemName", quantity, "unitPrice")
VALUES ('dom', 'a82919f1-1aa2-49d1-b3fe-4b14daeaa4eb', 'Nike Air Force', 1, 129.99);

INSERT INTO Basket (username, "catalogItemUid", "catalogItemName", quantity, "unitPrice")
VALUES ('dom', '42049faf-8b42-424a-9a2a-ae5d1a288a51', 'Nike Air Max', 1, 110.00);

INSERT INTO Basket (username, "catalogItemUid", "catalogItemName", quantity, "unitPrice")
VALUES ('dom', '9d36b0fe-3386-4b68-9356-09c569f7d632', 'S.Oliver Shirt', 2, 15.99);

COMMIT;

ANALYZE Basket;