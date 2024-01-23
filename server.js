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
    // Получаем все данные из таблицы "procedure"
    const procedureResult = await pool.query('SELECT * FROM public."procedure"');
    console.log('Результат запроса из таблицы "procedure":', procedureResult.rows);

    // Отправляем все данные клиенту
    res.send(procedureResult.rows);
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
    // Получаем все данные из таблицы "act_ge_bytearray"
    const actGeBytearrayResult = await pool.query('SELECT * FROM public."act_ge_bytearray" LIMIT 1000');
    console.log('Результат запроса из таблицы "act_ge_bytearray":', actGeBytearrayResult.rows);

    // Отправляем все данные клиенту
    res.send(actGeBytearrayResult.rows);
  } catch (error) {
    console.error('Ошибка при получении данных из таблицы "act_ge_bytearray":', error);
    res.status(500).send('Внутренняя ошибка сервера');
  } 
});


app.get('/api/procedureProcessDefinitionData', async (req, res) => {
  try {
    const actGeBytearrayResult = await pool.query('SELECT * FROM public."procedure_process_definition"');
    console.log('Результат запроса из таблицы "procedure_process_definition":', actGeBytearrayResult.rows);

    res.send(actGeBytearrayResult.rows);
  } catch (error) {
    console.error('Ошибка при получении данных из таблицы "procedure_process_definition":', error);
    res.status(500).send('Внутренняя ошибка сервера');
  } 
});
// node --max-old-space-size=4096 server.js если возникает переполнение выделенной памяти при запуске server.js
app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
