const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cors = require('cors')({ origin: true });
const app = express();

/* Use cors middleware */
app.use(cors);

/* POST /events/search */
app.post('/search', (req, res) => {
  const term = req.body.term;
  const results = req.body.results || [];
  const resultsCount = req.body.results.length;
  const _ga = req.body._ga;
  const _createdAt = admin.database.ServerValue.TIMESTAMP;

  const ref = admin.database().ref('/search');
  ref.push({
    term,
    results,
    resultsCount,
    _ga,
    _createdAt
  }).then(snapshop => {
    res.status(200).send('OK');
  });
});

/* GET /events/search */
app.get('/search', (req, res) => {
  const ref = admin.database().ref('/search');
  ref.on('value', snapshot => {
    res.json(Object.values(snapshot.val()));
  });
});

/* Mount all /events API endpoints */
exports.events = functions.https.onRequest(app);

exports.addSearch = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const term = req.body.term;
    const results = req.body.results || [];
    const resultsCount = req.body.results.length;
    const _ga = req.body._ga;

    const searchesRef = admin.database().ref('/searches');
    searchesRef.push({
      term,
      results,
      resultsCount,
      _ga
    }).then(snapshop => {
      res.status(200).send('OK');
    });
  });
});
