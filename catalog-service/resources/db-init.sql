CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE CatalogType
(
    id   SERIAL PRIMARY KEY,
    type VARCHAR(100) NOT NULL
);

CREATE TABLE CatalogBrand
(
    id    SERIAL PRIMARY KEY,
    brand VARCHAR(100) NOT NULL
);

CREATE TABLE CatalogItem
(
    id               SERIAL PRIMARY KEY,
    uid              VARCHAR(255)   DEFAULT uuid_generate_v4(),
    name             VARCHAR(100)   NOT NULL,
    price            NUMERIC(10, 2) NOT NULL,
    "availableStock" INTEGER        NOT NULL CHECK ("availableStock" >= 0),
    "catalogTypeId"  INTEGER        NOT NULL,
    "catalogBrandId" INTEGER        NOT NULL
);

INSERT INTO CatalogType (type)
VALUES ('T-Shirts');
INSERT INTO CatalogType (type)
VALUES ('Shoes');

INSERT INTO CatalogBrand (brand)
VALUES ('Nike');
INSERT INTO CatalogBrand (brand)
VALUES ('S-Oliver');

INSERT INTO CatalogItem (uid, name, price, "availableStock", "catalogTypeId", "catalogBrandId")
VALUES ('a82919f1-1aa2-49d1-b3fe-4b14daeaa4eb', 'Nike Air Force', 129.99, 10000, 2, 1);
INSERT INTO CatalogItem (uid, name, price, "availableStock", "catalogTypeId", "catalogBrandId")
VALUES ('42049faf-8b42-424a-9a2a-ae5d1a288a51', 'Nike Air Max', 110.00, 10000, 2, 1);
INSERT INTO CatalogItem (uid, name, price, "availableStock", "catalogTypeId", "catalogBrandId")
VALUES ('9d36b0fe-3386-4b68-9356-09c569f7d632', 'S.Oliver Shirt', 15.99, 10000, 1, 2);

ALTER TABLE CatalogItem
    ADD CONSTRAINT FK_CatalogItem_CatalogType FOREIGN KEY ("catalogTypeId") REFERENCES CatalogType (id);
ALTER TABLE CatalogItem
    ADD CONSTRAINT FK_CatalogItem_CatalogBrand FOREIGN KEY ("catalogBrandId") REFERENCES CatalogBrand (id);

CREATE UNIQUE INDEX IX_CatalogItem_uid ON CatalogItem (uid);

COMMIT;

ANALYZE CatalogType;
ANALYZE CatalogBrand;
ANALYZE CatalogItem;
