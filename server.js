const express = require('express');
const fetch = require('node-fetch');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3001;

// Подключение к PostgreSQL
const pool = new Pool({
  user: '*',
  host: '*',
  database: '*',
  password: '*:',
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
  

app.use(express.json());

// API-маршрут для получения данных из PostgreSQL и BPMN-ссылки
app.get('/api/bpmnData', async (req, res) => {
  try {
    // Получаем данные из PostgreSQL
    const pgResult = await pool.query('SELECT * FROM bpmn_data WHERE id = $1', [1]);
    const bpmnData = pgResult.rows[0]?.data;

    // Если данные в PostgreSQL отсутствуют, получаем их из BPMN-ссылки
    if (!bpmnData) {
      const response = await fetch('http://siu7.kspgmu-tst.pnz.gov:8192/vaadinServlet/APP/connector/0/324/dl/test.bpmn');
      const data = await response.text();

      // Сохраняем данные в PostgreSQL для последующих запросов
      await pool.query('INSERT INTO bpmn_data (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2', [1, data]);

      res.send(data);
    } else {
      res.send(bpmnData);
    }
  } catch (error) {
    console.error('Ошибка при получении данных BPMN:', error);
    res.status(500).send('Внутренняя ошибка сервера');
  }
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
