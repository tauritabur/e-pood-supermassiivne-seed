-- 1. Leia viimase kuu enim ostetud tooted (JOIN, GROUP BY, SUM, ORDER BY, LIMIT)
-- Selgitus: See päring näitab, milliseid tooteid on kõige rohkem ostetud viimase kuu jooksul.
-- Oodatav tulemus: product_name, total_sales, järjestatud ostukoguse järgi
SELECT
  p.product_name AS toode,
  SUM(oi.total_amount) AS totaal_ostud
FROM order_items oi
INNER JOIN products p ON oi.product_id = p.product_id
WHERE oi.shipping_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.product_name
ORDER BY totaal_ostud DESC
LIMIT 10;

-- 2. Leia kliendid, kes on teinud rohkem kui 20 tellimust (JOIN, GROUP BY, HAVING)
-- Selgitus: Selle päringu abil saab tuvastada kõige aktiivsemad kliendid turunduse/müügikampaaniate jaoks.
-- Oodatav tulemus: cust_name, email, tellimuste koguarv, ainult need kellel >20
SELECT
  c.cust_name AS klient,
  c.email AS email,
  COUNT(o.order_id) AS tellimuste_arv
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.cust_name, c.email
HAVING COUNT(o.order_id) > 20
ORDER BY tellimuste_arv DESC;

-- 3. Leia kõik kliendid, kes on tellinud viimase 7 päeva jooksul (JOIN, WHERE, DISTINCT)
-- Selgitus: See päring võimaldab klienditoel näha, kes tellis viimase nädala jooksul ning vajadusel pakkuda järelteenindust.
-- Oodatav tulemus: cust_name, email, shipping_address
SELECT DISTINCT
  c.cust_name AS klient,
  c.email AS email,
  c.shipping_address AS aadress
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.delivery_date >= CURRENT_DATE - INTERVAL '7 days';

-- 4. Leia keskmine, suurim ja väikseim tellimuse kogusumma (AGGREGATE, MIN/MAX/AVG)
-- Selgitus: Päring annab ülevaate ostukorvide suurusest (numbrite järgi ostutrendi analüüsiks).
-- Oodatav tulemus: keskmine, suurim ja väikseim kogusumma order_items tabelis.
SELECT
  AVG(oi.total_amount) AS keskmine_summa,
  MAX(oi.total_amount) AS suurim_summa,
  MIN(oi.total_amount) AS vaikseim_summa
FROM order_items oi;

-- 5. Leia ja sorteeri kõik „Pending“ staatusega tellimused (WHERE, ORDER BY, LIMIT, veeru aliased)
-- Selgitus: Klienditoe vaatest saab näha aktiivseid tellimusi, mis veel täitmata.
-- Oodatav tulemus: order_id, klient, tellimuse staatus, tarnekuupäev
SELECT
  o.order_id AS tellimus,
  c.cust_name AS klient,
  o.order_status AS staatus,
  o.delivery_date AS tarnepaev
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id
WHERE o.order_status = 'Pending'
ORDER BY o.delivery_date
LIMIT 25;

-- 6. Leia 5 kõige aktiivsemat klienti (3 tabeli JOIN + GROUP BY + SUM + ORDER BY)
-- Selgitus: Väljavõte, millised kliendid on enim ostnud (summed order_items kaudu, liidab kõik ostud).
-- Oodatav tulemus: klient, email, tellimuste arv, ostude kogu summa
SELECT
  c.cust_name AS klient,
  c.email AS email,
  COUNT(DISTINCT o.order_id) AS tellimused,
  SUM(oi.total_amount) AS kogu_ostusumma
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
INNER JOIN order_items oi ON o.order_id = oi.order_id
GROUP BY c.customer_id, c.cust_name, c.email
ORDER BY kogu_ostusumma DESC
LIMIT 5;
