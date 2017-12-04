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

/* POST /events/view */
app.post('/view', (req, res) => {
  const name = req.body.name;
  const path = req.body.path;
  const _ga = req.body._ga;
  const _createdAt = admin.database.ServerValue.TIMESTAMP;

  const ref = admin.database().ref('/view');
  ref.push({
    name,
    path,
    _ga,
    _createdAt
  }).then(snapshop => {
    res.status(200).send('OK');
  });
});

/* GET /events/view */
app.get('/view', (req, res) => {
  const ref = admin.database().ref('/view');
  ref.on('value', snapshot => {
    res.json(Object.values(snapshot.val()));
  });
});

/* Mount all /events API endpoints */
exports.events = functions.https.onRequest(app);
