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
app.get('/', (req, res) => {
  // Access query parameters using req.query
  const { page, pageSize, sortColumn, asc, searchString, selectedGenres, selectedPublishers, yearFrom, yearTo,
    naSalesFrom, naSalesTo, euSalesFrom, euSalesTo, jpSalesFrom, jpSalesTo,
  otherSalesFrom, otherSalesTo, globalSalesFrom, globalSalesTo, reviewCountFrom, reviewCountTo
   } = req.query;
  // Log the query parameters
  data.getGames(page, pageSize, sortColumn, asc, searchString, selectedGenres, selectedPublishers, yearFrom, yearTo, naSalesFrom, naSalesTo, euSalesFrom, euSalesTo, jpSalesFrom, jpSalesTo,
    otherSalesFrom, otherSalesTo, globalSalesFrom, globalSalesTo, reviewCountFrom, reviewCountTo ).then(response => {
        res.status(200).send(response);
      }).catch(error => {
        res.status(500).send(error);
      })
    });

app.get('/total', async (req, res) => {
  const { searchString } = req.query;
  data.getGameRowCount(searchString).then(response => {
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

// get genres
app.get('/genres', (req, res) => {
  data.getGenres()
  .then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
})

// get publishers
app.get('/publishers', (req, res) => {
  data.getPublishers()
  .then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
})

// get specific game data
app.get('/:id', (req, res) => {
  data.getGame(req.params.id)
  .then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
})

// Review CRUD
app.post('/games/:id', (req, res) => {
  data.createReview(req.params.id, req.body)
  .then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
});

app.get('/games/:gameId', async (req, res) => {
  const { page, pageSize } = req.query;
  data.getReviews(req.params.gameId, page, pageSize).then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
});

// total review row count
app.get('/totalRev/:id', async (req, res) => {
  data.totalReviewRows(req.params.id).then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
});

// upd review
app.put('/games/:id/:revId', (req, res) => {
  data.updateReview(req.body)
  .then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
});

// del review
app.delete('/games/:gameId/:revId', (req, res) => {
  data.deleteReview(req.params.revId)
  .then(response => {
    res.status(200).send(response);
  }).catch(error => {
    res.status(500).send(error);
  })
});

app.listen(3000, () => {
    console.log(`Server is running on port 3000.`);
});
