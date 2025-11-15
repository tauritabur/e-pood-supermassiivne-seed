# e-pood-supermassiivne-seed

## Eeldused
- Docker & docker-compose
- Bun (või Node.js), npm, @faker-js/faker
- PostgreSQL 15+

## Sammud
1. Käivita andmebaas: `docker-compose up -d`
2. Loo skeem: `psql -U postgres -d epood -h localhost < dump.sql`
3. Paigalda sõltuvused: `bun add @faker-js/faker pg` (või `npm install`)
4. Käivita seemneskript: `bun run seed.js` (või `node seed.js`)
5. Kontrolli row-countid:
   - customers: 2M+
   - products: 120k+
   - orders: 2.2M+
   - order_items: 8M+

## Andmete ehtsus ja terviklus
- Kasutatakse Faker.js Euroopa lokaati (nimed, e-mailid, aadressid, toodete andmed)
- FK-d: `orders` viitab `customers`, `order_items` viitab `orders` ja `products` — kõik viited kehtivad, orvukirjeid pole
- Mass-BULK INSERT, partiid 10 000 kaupa
- Tulemused täielikult reprodutseeritavad (`faker.seed(12345)`)

## Tabelite mahud ja proportsioonid
- Customers: 2 000 000
- Products: 120 000
- Orders: 2 200 000
- Order_items: 8 000 000
- Loogika: `orders` ja `customers` on põhikoormus, `products` piisavalt et igal orderil oleks valikut, `order_items` kõige massiivsem

## Kogukestus ja ressursid
- Kogu protsess ~40–90 min (sõltuvalt serverist/lokatsioonist)
- Docker Compose, psql, Bun install nullist — kõik juhised README-s

## Repo nimi
- `e-pood-supermassiivne-seed` – peegeldab projekti sisu

## Lisainfo
- Võimalikud modifikatsioonid, et skeemi ja andmeproportsioone muuta
- README juhised sobivad Windows, Mac, Linux/Docker platvormile
