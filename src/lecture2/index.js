'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())
// parse application/json
   .use(bodyParser.json());

const users = [{id: 10, name: 'Alan'},{id: 20, name:'Jao'}]

//Exercise 1
app.get('/exerc1', function(request, response) {
  console.log('Exercise 1');
  response.send('Hello World!');
});

//Exercise 2
app.get('/', function(request, response) {
  console.log('Exercise 2');
  const userName = request.query.q;
  console.log(userName);
  if(userName){
    var result_user = users.find((user) => user.name == userName );
    result_user && response.send(result_user) ||
    response.status(404).send('Not Found');
  }else{
    response.send(users);
  }
});


//Exercise 3
app.post('/users', function(request, response) {
  console.log('Exercise 3');
  const data = request.body;
  console.log(data);
  if(data && data.name){
    var newUser = {id: 1,name: data.name}
    users.forEach((user) => {
      user.id >= newUser.id && (newUser.id=user.id+1);
    });
    users.push(newUser);
    response.status(201).send(newUser);
  }else{
    response.sendStatus(403);
  }
});


//Exercicio 7
app.route('/users/:userId')
   .get((request, response) => {
      console.log(`Exercise 4 - id: ${request.params.userId}`);
      var result_user = users.find((user) => user.id == request.params.userId );
      result_user && response.send(result_user) ||
      response.sendStatus(204);
    })
   .delete((request, response) => {
      console.log(`Exercise 5 - id: ${request.params.userId}`);
      var index = users.findIndex((user) => user.id == request.params.userId );
      index>-1 && users.splice(index,1) && response.sendStatus(204) ||
      response.sendStatus(404);
    })
   .put((request, response) => {
      console.log(`Exercise 6 - id: ${request.params.userId}`);
      const data = request.body;
      console.log(data);
      if (data && data.password) {
        var result_user = users.find((user) => user.id == request.params.userId );
        result_user && (result_user.password=data.password) && response.send(result_user) ||
        response.sendStatus(404);
      }else{
        response.sendStatus(403);
      }
    });

app.listen(3000, function(){
  console.log('Listening on port 3000...');
});
