'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const routes = {
  root: require('./routes/rootRoute'),
  users: require('./routes/usersRoute')
}
const Cookie = require('./lib/cookie');

const app = express();
app
// Exercise 1
  // parse application/x-www-form-urlencoded
  .use(bodyParser.urlencoded())
  // parse application/json
  .use(bodyParser.json())
// Exercise 2
  // Static
  .use(express.static('../public'));

// Exercise 3
const hostConfig = {
  host: 'localhost',
  port: 3000,
  appName: 'Lecture3'
};

// Exercise 4
app.use(Cookie(hostConfig));

// Exercise 5
app.use('/', routes.root);
app.use('/users', routes.users);

app.listen(hostConfig.port, function(){
  console.log(`Listening on port ${hostConfig.port}...`);
});
