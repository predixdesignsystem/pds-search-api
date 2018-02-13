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

const hoursAgoMilli = n => Date.now() - hoursToMilli(n);
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

/* Time helpers */
const hoursToMilli = n => n * 3600000;
const daysToMilli = n => n * hoursToMilli(24);

/* Does what Object.values does for environments that don't have it */
const toValues = o => {
  let vals = [];
  const keys = Object.keys(o);
  for (let i=0; i<keys.length; i++) {
    vals.push(o[keys[i]]);
  }
  return vals;
};

/* Helper function: reduce entries to a count */
const reduceByVal = (arr, key) => {
  let results = arr.map(v => v[key]).reduce((acc, val) => {
    if (!acc[val]) {
      acc[val] = {};
      acc[val][key] = val;
      acc[val]['count'] = 0;
    }
    acc[val].count++;
    return acc;
  }, {});
  results = toValues(results);
  results.sort((a, b) => b.count - a.count);
  return results;
};

/* Capitalizes the first letter of a string and returns it. */
const capitalize = str => str[0].toUpperCase() + str.slice(1);

/* Turns page paths into human-readable section titles for the website. */
const pathToSectionTitle = path => {
  const section = path.split('/')[2];
  if (section) {
    if (section === 'elements') {
      return 'Component Docs';
    }
    if (section === 'css') {
      return 'CSS Docs';
    }
    if (section === 'develop') {
      return 'Developer Guides';
    }
    if (section === 'design') {
      return 'Design Guidelines';
    }
    if (section === 'about') {
      return 'Getting Started';
    }
    return capitalize(section);
  }
  return 'Unknown';
}

/*
 * Returns interesting stats for the last 10 days.
 *
 * GET /stats10d/
 *
 * RESPONSE (200):
 *
 *     {
 *       "totalViews10d": 3487,
 *       "totalViews24h": 104,
 *       "topPages10d": [
 *         { "name": "Home", "count": 110 },
 *         ... 25 results ...
 *       ],
 *       "topSections": [
 *         { "section": "Developer Guides", count: 30 },
 *         ... more results ...
 *       ]
 *     }
 *
 */
exports.stats10d = functions.https.onRequest((req, res) => {
  const ref = admin.database().ref('/view');
  const milliTenDaysAgo = Date.now() - daysToMilli(10);
  const milliOneDayAgo = Date.now() - hoursToMilli(24);
  ref.orderByChild('_createdAt').startAt(milliTenDaysAgo).once('value', snapshot => {
    const views = toValues(snapshot.val());
    const topViews = reduceByVal(views, 'name');
    const topSections = reduceByVal(
      views.map(v => Object.assign({}, v, { section: pathToSectionTitle(v.path) })), 'section'
    );
    const views24h = views.filter(v => v._createdAt > milliOneDayAgo);
    res.json({
      "totalViews10d" : views.length,
      "topPages10d" : topViews.slice(0,25),
      "topSections10d" : topSections,
      "totalViews24h" : views24h.length
    });
  });
});
