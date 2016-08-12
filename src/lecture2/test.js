'use strict';

const HandlerHttp = require('../../lib/handlerHttp');

const options = {
    host: 'localhost',
    port: 3000
};
const http = HandlerHttp(options);

// Exercicio 1
http.get('/exerc1');

// Exercicio 2
http.get('/');
http.get('/','q=Alan');

// Exercicio 3
http.post('/users',{name: 'Exerc3'});

// Exercicio 4
http.get('/users/10');

// Exercicio 5
http.delete('/users/21');

// Exercicio 6
http.put('/users/10',{password: '1234'});
