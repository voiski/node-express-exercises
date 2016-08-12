'use strict';

const HandlerHttp = require('../../lib/handlerHttp');

const options = {
    host: 'localhost',
    port: 3000,
    headers: {
        Cookie: 'Lecture3=HanSoloShootsFirst'
    }
};
const http = HandlerHttp(options);

http.get('/');
http.get('/', 'q=Bruno%20Araujo');

http.get('/users/1', null, (user) => {
    const newPassword = user.password == 'atletico' ? 'cruzeiro' : 'atletico';
    http.put('/users/1', {
        oldPassword: user.password,
        newPassword: newPassword
    });
});

http.post('/users', {
    name: 'Alan Voiski',
    email: 'avoiski@avenuecode.com',
    password: 'nodejs'
}, (user) => {
    http.delete(`/users/${user._id}`);
});
