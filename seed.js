import { faker } from "@faker-js/faker";
import { Client } from "pg";

faker.seed(12345);

const BATCH_SIZE = 10000;

const TOTAL_CUSTOMERS = 2000000;
const TOTAL_PRODUCTS = 120000;
const TOTAL_ORDERS = 2200000;
const TOTAL_ORDER_ITEMS = 8000000;

const client = new Client({
  user: "student",
  password: "salasona",
  database: "e_pood",
  host: "localhost",
  port: 5432,
});

function escapeString(str) {
  return String(str).replace(/'/g, "''");
}

async function seedTable(table, rows, columns) {
  const query = `INSERT INTO ${table} (${columns.join(",")}) VALUES ${rows.join(",")}`;
  await client.query(query);
}

(async () => {
  await client.connect();

  console.log("Customers...");

  for (let i = 0; i < TOTAL_CUSTOMERS; i += BATCH_SIZE) {
    const rows = [];

    for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_CUSTOMERS; j++) {
      rows.push(
        `('${escapeString(faker.person.fullName())}','${escapeString(faker.internet.email())}','${escapeString(faker.location.streetAddress())}')`
      );
    }

    await seedTable(
      "customers",
      rows,
      ["cust_name", "email", "shipping_address"]
    );

    console.log(`${Math.min(i + BATCH_SIZE, TOTAL_CUSTOMERS)} customers`);
  }

  console.log("Products...");

  for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
    const rows = [];

    for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_PRODUCTS; j++) {
      rows.push(
        `('${escapeString(faker.commerce.productName())}','${escapeString(faker.commerce.productDescription())}',${faker.commerce.price()})`
      );
    }

    await seedTable(
      "products",
      rows,
      ["product_name", "product_description", "product_rate"]
    );

    console.log(`${Math.min(i + BATCH_SIZE, TOTAL_PRODUCTS)} products`);
  }

  console.log("Orders...");

  for (let i = 0; i < TOTAL_ORDERS; i += BATCH_SIZE) {
    const rows = [];

    for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_ORDERS; j++) {
      const customer = faker.number.int({
        min: 1,
        max: TOTAL_CUSTOMERS,
      });

      const status = faker.helpers.arrayElement([
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
      ]);

      const date = faker.date
        .between({
          from: "2023-01-01",
          to: "2025-12-31",
        })
        .toISOString()
        .slice(0, 10);

      rows.push(`(${customer},'${status}','${date}')`);
    }

    await seedTable(
      "orders",
      rows,
      ["customer_id", "order_status", "delivery_date"]
    );

    console.log(`${Math.min(i + BATCH_SIZE, TOTAL_ORDERS)} orders`);
  }

  console.log("Order items...");

  for (let i = 0; i < TOTAL_ORDER_ITEMS; i += BATCH_SIZE) {
    const rows = [];

    for (let j = 0; j < BATCH_SIZE && i + j < TOTAL_ORDER_ITEMS; j++) {
      const order = faker.number.int({
        min: 1,
        max: TOTAL_ORDERS,
      });

      const product = faker.number.int({
        min: 1,
        max: TOTAL_PRODUCTS,
      });

      const amount = faker.commerce.price();

      const shipDate = faker.date
        .between({
          from: "2023-01-01",
          to: "2025-12-31",
        })
        .toISOString()
        .slice(0, 10);

      rows.push(`(${order},${product},${amount},'${shipDate}')`);
    }

    await seedTable(
      "order_items",
      rows,
      ["order_id", "product_id", "total_amount", "shipping_date"]
    );

    console.log(`${Math.min(i + BATCH_SIZE, TOTAL_ORDER_ITEMS)} order_items`);
  }

  await client.end();

  console.log("DONE");
})();
