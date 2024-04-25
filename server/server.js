const express = require('express');
const cors = require('cors');
const data = require('./data');

const app = express();

// allow client to communicate with server
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
    next();
});

app.use(cors());
app.use(express.json());

// Game CRUD
app.get('/', async (req, res) => {
    data.getGames().then(response => {
      res.status(200).send(response);
    }).catch(error => {
      res.status(500).send(error);
    })
});

app.post('/games', (req, res) => {
  data.createGame(req.body)
  .then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
});

app.put('/games/:id', (req, res) => {
  const id = req.params.id;
  const form = req.body;
  data.updateGame(id, form)
  .then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
});

app.delete('/games/:id', (req, res) => {
  data.deleteGame(req.params.id)
  .then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
});

// Review get

app.get('/games/:id', async (req, res) => {
  data.getReviews(req.params.name).then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000.`);
});