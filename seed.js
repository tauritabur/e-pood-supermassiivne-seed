import { faker } from '@faker-js/faker';
import { Client } from 'pg';

faker.seed(12345);

const BATCH_SIZE = 10000;
const TOTAL_CUSTOMERS = 2000000;
const TOTAL_PRODUCTS = 120000;
const TOTAL_ORDERS = 2200000;
const TOTAL_ORDER_ITEMS = 8000000;

const client = new Client({
  user: 'postgres',
  password: 'salapass',
  database: 'epood',
  host: 'localhost',
  port: 5432,
});

async function seedTable(table, values, columns) {
  const query = `INSERT INTO ${table} (${columns.join(',')}) VALUES ${values.join(',')}`;
  await client.query(query);
}

(async () => {
  await client.connect();

  // Customers
  for (let i = 0; i < TOTAL_CUSTOMERS; i += BATCH_SIZE) {
    const rows = [];
    for (let j = 0; j < BATCH_SIZE && (i + j) < TOTAL_CUSTOMERS; j++) {
      rows.push(
        `('${faker.person.fullName()}', '${faker.internet.email()}', '${faker.location.streetAddress()}')`
      );
    }
    await seedTable("customers", rows, ["cust_name", "email", "shipping_address"]);
    console.log("Inserted customers:", i + BATCH_SIZE);
  }

  // Products
  for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
    const rows = [];
    for (let j = 0; j < BATCH_SIZE && (i + j) < TOTAL_PRODUCTS; j++) {
      rows.push(
        `('${faker.commerce.productName()}', '${faker.commerce.productDescription()}', '${faker.commerce.price()}')`
      );
    }
    await seedTable("products", rows, ["product_name", "product_description", "product_rate"]);
    console.log("Inserted products:", i + BATCH_SIZE);
  }

  // Orders
  for (let i = 0; i < TOTAL_ORDERS; i += BATCH_SIZE) {
    const rows = [];
    for (let j = 0; j < BATCH_SIZE && (i + j) < TOTAL_ORDERS; j++) {
      const custId = faker.number.int({ min: 1, max: TOTAL_CUSTOMERS });
      rows.push(
        `(${custId}, '${faker.helpers.arrayElement(["Pending","Confirmed","Shipped","Delivered"])}', '${faker.date.between({ from: '2023-01-01', to: '2025-12-31'}).toISOString().slice(0,10)}')`
      );
    }
    await seedTable("orders", rows, ["customer_id", "order_status", "delivery_date"]);
    console.log("Inserted orders:", i + BATCH_SIZE);
  }

  // Order_items
  for (let i = 0; i < TOTAL_ORDER_ITEMS; i += BATCH_SIZE) {
    const rows = [];
    for (let j = 0; j < BATCH_SIZE && (i + j) < TOTAL_ORDER_ITEMS; j++) {
      const ordId = faker.number.int({ min: 1, max: TOTAL_ORDERS });
      const prodId = faker.number.int({ min: 1, max: TOTAL_PRODUCTS });
      rows.push(
        `(${ordId}, ${prodId}, '${faker.commerce.price()}', '${faker.date.between({ from: '2023-01-01', to: '2025-12-31'}).toISOString().slice(0,10)}')`
      );
    }
    await seedTable("order_items", rows, ["order_id", "product_id", "total_amount", "shipping_date"]);
    console.log("Inserted order_items:", i + BATCH_SIZE);
  }

  await client.end();
})();
