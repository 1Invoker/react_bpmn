const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3001;

require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, done) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
  } else {
    console.log('Подключение к базе данных успешно!');
  }
  done();
});

// app.use(express.json());
app.use(cors());

// API-маршрут для получения данных из таблицы "procedure"
app.get('/api/bpmnData', async (req, res) => {
  try {
    const procedureResult = await pool.query(`
    SELECT "procedure"."id", "procedure"."name", "procedure_process_definition"."processdefinitionkey","procedure"."locked",
    "act_re_procdef"."deployment_id_", "act_ge_bytearray"."name_", convert_from("act_ge_bytearray"."bytes_", 'UTF8') as "xml"
    FROM "procedure"
    INNER JOIN "procedure_process_definition" ON "procedure"."id" = "procedure_process_definition"."procedure_id"
    INNER JOIN (
      SELECT "procedure_id", MAX("version") "lastVersion" FROM "procedure_process_definition" GROUP BY "procedure_id"
    ) "ppd" ON "procedure"."id" = "ppd"."procedure_id" AND "procedure_process_definition"."version" = "ppd"."lastVersion"
    INNER JOIN "act_re_procdef" ON "act_re_procdef"."key_" = "procedure_process_definition"."processdefinitionkey"
    INNER JOIN (
      SELECT "key_", MAX("deployment_id_") "lastDeployment" FROM "act_re_procdef" GROUP BY "key_"
    ) "arp" ON "procedure_process_definition"."processdefinitionkey" = "arp"."key_" AND "act_re_procdef"."deployment_id_" = "arp"."lastDeployment"
    INNER JOIN "act_ge_bytearray" "act_ge_bytearray" ON "act_ge_bytearray"."deployment_id_" = "act_re_procdef"."deployment_id_" AND "act_ge_bytearray"."name_" = "act_re_procdef"."resource_name_"
    ORDER BY "procedure"."id" ASC
    `);
    console.log(
      'Результат запроса из таблицы "procedure":',
      procedureResult.rows,
    );

    res.send(procedureResult.rows);
  } catch (error) {
    console.error('Ошибка при получении данных из таблицы "procedure":', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

app.get('/api/bpmnAdministrative', async (req, res) => {
  try {
    const procedureResult = await pool.query(`
    select "procedure"."id", "procedure"."name",
"procedure"."datecreated", "procedure"."dateupdated", "procedure"."status", "procedure"."registercode", 
convert_from("act_ge_bytearray"."bytes_", 'UTF8') as "xml"
from "procedure" 
inner join "procedure_process_definition" on "procedure"."id" = "procedure_process_definition"."procedure_id"
INNER join 
  (SELECT "procedure_id", MAX("version") "lastVersion" FROM "procedure_process_definition" GROUP BY "procedure_id") "ppd" 
ON "procedure"."id" = "ppd"."procedure_id" AND "procedure_process_definition"."version" = "ppd"."lastVersion"
inner join "act_re_procdef" on "act_re_procdef"."key_" = "procedure_process_definition"."processdefinitionkey"
INNER join 
  (SELECT "key_", MAX("deployment_id_") "lastDeployment" FROM "act_re_procdef" GROUP BY "key_") "arp" 
ON "procedure_process_definition"."processdefinitionkey" = "arp"."key_" AND "act_re_procdef"."deployment_id_" = "arp"."lastDeployment"
inner join "act_ge_bytearray" "act_ge_bytearray" ON "act_ge_bytearray"."deployment_id_" = "act_re_procdef"."deployment_id_" AND "act_ge_bytearray"."name_" = "act_re_procdef"."resource_name_"
where "procedure"."locked" = false and "procedure"."type" = 0 order by "procedure"."id" asc LIMIT 50
    `);
    console.log('Результат запроса из таблицы :', procedureResult.rows);

    res.send(procedureResult.rows);
  } catch (error) {
    console.error('Ошибка при получении данных из таблицы :', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

app.get('/api/bpmnMezved', async (req, res) => {
  try {
    const procedureResult = await pool.query(`
    select "procedure"."id", "procedure"."name", "procedure_process_definition"."processdefinitionkey",
"procedure"."datecreated", "procedure"."dateupdated", "procedure"."status", convert_from("act_ge_bytearray"."bytes_", 'UTF8') as "xml"
from "procedure" 
inner join "procedure_process_definition" on "procedure"."id" = "procedure_process_definition"."procedure_id"
INNER join 
  (SELECT "procedure_id", MAX("version") "lastVersion" FROM "procedure_process_definition" GROUP BY "procedure_id") "ppd" 
ON "procedure"."id" = "ppd"."procedure_id" AND "procedure_process_definition"."version" = "ppd"."lastVersion"
inner join "act_re_procdef" on "act_re_procdef"."key_" = "procedure_process_definition"."processdefinitionkey"
INNER join 
  (SELECT "key_", MAX("deployment_id_") "lastDeployment" FROM "act_re_procdef" GROUP BY "key_") "arp" 
ON "procedure_process_definition"."processdefinitionkey" = "arp"."key_" AND "act_re_procdef"."deployment_id_" = "arp"."lastDeployment"
inner join "act_ge_bytearray" "act_ge_bytearray" ON "act_ge_bytearray"."deployment_id_" = "act_re_procdef"."deployment_id_" AND "act_ge_bytearray"."name_" = "act_re_procdef"."resource_name_"
where "procedure"."locked" = false and "procedure"."type" = 1 order by "procedure"."id" asc
    `);
    console.log('Результат запроса из таблицы :', procedureResult.rows);

    res.send(procedureResult.rows);
  } catch (error) {
    console.error('Ошибка при получении данных из таблицы :', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});
app.get('/api/bpmnMezvedCatalog', async (req, res) => {
  try {
    const procedureResult = await pool.query(`
    select "procedure"."id", "procedure"."name", "procedure"."status", "procedure_process_definition"."processdefinitionkey"
from "procedure" 
inner join "procedure_process_definition" on "procedure"."id" = "procedure_process_definition"."procedure_id"
INNER join 
  (SELECT "procedure_id", MAX("version") "lastVersion" FROM "procedure_process_definition" GROUP BY "procedure_id") "ppd" 
ON "procedure"."id" = "ppd"."procedure_id" AND "procedure_process_definition"."version" = "ppd"."lastVersion"
inner join "act_re_procdef" on "act_re_procdef"."key_" = "procedure_process_definition"."processdefinitionkey"
INNER join 
  (SELECT "key_", MAX("deployment_id_") "lastDeployment" FROM "act_re_procdef" GROUP BY "key_") "arp" 
ON "procedure_process_definition"."processdefinitionkey" = "arp"."key_" AND "act_re_procdef"."deployment_id_" = "arp"."lastDeployment"
inner join "act_ge_bytearray" "act_ge_bytearray" ON "act_ge_bytearray"."deployment_id_" = "act_re_procdef"."deployment_id_" AND "act_ge_bytearray"."name_" = "act_re_procdef"."resource_name_"
where "procedure"."locked" = false and "procedure"."type" = 1 order by "procedure"."id" asc
    `);
    console.log('Результат запроса из таблицы :', procedureResult.rows);

    res.send(procedureResult.rows);
  } catch (error) {
    console.error('Ошибка при получении данных из таблицы :', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
