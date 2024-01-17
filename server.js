const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// Подключение к PostgreSQL
const pool = new Pool({
  user: '*',
  host: '*',
  database: '*',
  password: '*',
  port: 5432,
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
    // Получаем данные из таблицы "procedure"
    const procedureResult = await pool.query('SELECT * FROM public."procedure" WHERE id = $1', [1]);
    console.log('Результат запроса из таблицы "procedure":', procedureResult.rows);
    const procedureData = procedureResult.rows[0]?.data;

    // Если данные в PostgreSQL отсутствуют, получаем их из BPMN-ссылки
    if (!procedureData) {
      // const response = await fetch('http://siu7.kspgmu-tst.pnz.gov:8192/vaadinServlet/APP/connector/0/324/dl/test.bpmn');
      // const data = await response.text();

      // Сохраняем данные в таблицу "bpmn_data" для последующих запросов
      // await pool.query('INSERT INTO bpmn_data (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2', [1, data]);

      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send("procedureData missing");
    } else {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.send(procedureData);
    }
  } catch (error) {
    console.error('Ошибка при получении данных из таблицы "procedure":', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

// Добавляем новый API-маршрут для получения данных из таблицы "act_re_procdef"
app.get('/api/actReProcdefData', async (req, res) => {
  try {
    // Получаем все данные из таблицы "act_re_procdef"
    const actReProcdefResult = await pool.query('SELECT * FROM public."act_re_procdef"');
    console.log('Результат запроса из таблицы "act_re_procdef":', actReProcdefResult.rows);

    // Отправляем все данные клиенту
    res.send(actReProcdefResult.rows);
  } catch (error) {
    console.error('Ошибка при получении данных из таблицы "act_re_procdef":', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

// Добавляем еще один API-маршрут для получения данных из таблицы "act_ge_bytearray"
app.get('/api/actGeBytearrayData', async (req, res) => {
  try {
    // Получаем данные из таблицы "act_ge_bytearray"
    const actGeBytearrayResult = await pool.query('SELECT * FROM public."act_ge_bytearray" WHERE id_ = $1', [1]);
    console.log('Результат запроса из таблицы "act_ge_bytearray":', actGeBytearrayResult.rows);
    const actGeBytearrayData = actGeBytearrayResult.rows[0]?.data;

    // Обработка данных

    res.send(actGeBytearrayData);
  } catch (error) {
    console.error('Ошибка при получении данных из таблицы "act_ge_bytearray":', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
