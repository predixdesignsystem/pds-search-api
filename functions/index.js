const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

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
