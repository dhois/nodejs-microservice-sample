# Getting Started
## Prerequisites
* npm version 8.15.1 or later
* node version 16.16.0 or later
* docker with compose version 3.8 or later

## Run
Clone the repository and run the following commands:
```bash
docker compose -p "node" build
docker compose -p "node" up -d
```

# Stop
```bash
docker compose -p "node" down
```

# Usage
## Rest-API
**HAProxy**
* http://localhost:40100/admin?stats
* PORT can be: 40100, 40200 or 40300

**basket-service**

* GET http://localhost:40100/basket/dom

**catalog-service**

* GET http://localhost:40200/catalog/<uuid>
  * example: http://localhost:40200/catalog/a82919f1-1aa2-49d1-b3fe-4b14daeaa4eb
* POST http://localhost:40200/catalog/reduceStock
```json
[
  {
    "catalogItemUid": "a82919f1-1aa2-49d1-b3fe-4b14daeaa4eb",
    "quantity": 1
  },
  {
    "catalogItemUid": "42049faf-8b42-424a-9a2a-ae5d1a288a51",
    "quantity": 1
  },
  {
    "catalogItemUid": "9d36b0fe-3386-4b68-9356-09c569f7d632",
    "quantity": 2
  }
]
```

**order-service**

* GET http://localhost:40300/order/dom
* POST http://localhost:40300/order/dom
```json
{
  "username": "dom",
  "shippingAddress": "some address",
  "billingAddress": "some address",
  "creditCard": "some credit card",
  "expiryDate": "12/2021",
  "totalPrice": "255.98"
}
```

## Tools
* **Postgres**: http://localhost:5432
* **Grafana**: http://localhost:3000
* **Prometheus**: http://localhost:9090
* **Jaeger**: http://localhost:16686
* **Kibana**: http://localhost:5601
