const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cors = require('cors')({ origin: true });

/************** EVENTS **************/

/* Create express app for events */
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


/************** STATS **************/

/* Helper functions: time */
const hoursToMilli = n => n * 3600000;
const hoursAgoMilli = n => Date.now() - hoursToMilli(n);
const daysToMilli = n => n & hoursToMilli(24);
const daysAgoMilli = n => Date.now() - daysToMilli(n);

/* Helper functions: query last n entries */
const getEntriesWithinLastNMilli = (refPath, milli) => {
  return new Promise((resolve, reject) => {
    const ref = admin.database().ref(refPath);
    ref.orderByChild('_createdAt').startAt(milli).once('value', snapshot => {
      resolve(snapshot.val());
    });
  });
};
const getEntriesWithinLastNHours = (refPath, hours) =>
  getEntriesWithinLastNMilli(refPath, hoursAgoMilli(hours));
const getEntriesWithinLastNDays = (refPath, days) =>
  getEntriesWithinLastNMilli(refPath, daysAgoMilli(days));

/* Helper function: reduce entries to a count */
const reduceByVal = (arr, key) => {
  let results = arr.map(v => v[key]).reduce((acc, val) => {
    if (!acc[val]) acc[val] = {"key":val, "count":0};
    acc[val].count++;
    return acc;
  }, {});
  results = Object.values(results);
  results.sort((a, b) => b.count - a.count);
  return results;
};

/*
 * GET /statsViews/?time=3d
 * - Gets view stats within the last 3 days
 *
 * GET /statsViews/?time=6h
 * - Gets view stats within the last 6 hours
 */
exports.statsViews = functions.https.onRequest((req, res) => {
  let within = req.query.time;
  // Time defaults to 24 hours
  if (!within || !/[0-9]+(d|h)/.test(within)) {
    within = '24h';
  }
  const timeUnit = within.slice(-1);
  let timeValue = Math.floor(within.slice(0, within.length-1));
  if (timeUnit === 'd') {
    timeValue = timeValue * 24;
  }

  return getEntriesWithinLastNHours('/view', timeValue).then(entries => {
    const views = Object.values(entries || {});
    const uniques = reduceByVal(views, 'name');
    res.json({
      totalCount: views.length,
      uniqueCount: uniques.length,
      top: uniques
    });
  });
});

/*
 * GET /statsSearches/?time=3d
 * - Gets view stats within the last 3 days
 *
 * GET /statsSearches/?time=6h
 * - Gets view stats within the last 6 hours
 */
exports.statsSearches = functions.https.onRequest((req, res) => {
  let within = req.query.time;
  // Time defaults to 24 hours
  if (!within || !/[0-9]+(d|h)/.test(within)) {
    within = '24h';
  }
  const timeUnit = within.slice(-1);
  let timeValue = Math.floor(within.slice(0, within.length-1));
  if (timeUnit === 'd') {
    timeValue = timeValue * 24;
  }

  return getEntriesWithinLastNHours('/search', timeValue).then(entries => {
    const searches = Object.values(entries || {});
    const uniques = reduceByVal(searches, 'term');
    res.json({
      totalCount: searches.length,
      uniqueCount: uniques.length,
      top: uniques
    });
  });
});
