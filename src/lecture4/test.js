'use strict';

const HandlerHttp = require('../../lib/handlerHttp');
var colors = require('colors/safe');

const BaseOptions = () => {
    return {
        host: 'localhost',
        port: 3000,
        headers: {
            Cookie: 'Lecture3=HanSoloShootsFirst'
        }
    }
};

const shouldFail = (_data, _request, response) => console.log('Should fail');
const describe = (desc, enabled, callback) => {
    if (enabled) {
        console.log(`Running ${desc}`)
        callback();
    }
};
const expect = (value) => {
    const handleExpectLog = (condition, msg, skipSuccessMsg) => {
        if (condition) {
            !skipSuccessMsg && console.log(colors.green('Success'));
            return true;
        } else {
            console.log(colors.red(`ERROR: ${msg}`));
            return false;
        }
    };
    return {
        equals: (ref) => {
            return handleExpectLog(value == ref, `Expect ${value} to be equals to ${ref}`);
        },
        not_equals: (ref) => {
            return handleExpectLog(value != ref, `Expect ${value} to not be equals to ${ref}`);
        },
        fails: () => {
            return handleExpectLog(value.statusCode >= 300, `Expect response fail!`, true);
        }
    }
};
expect.fails = (msg) => {
    return (data, _request, response) => {
        expect(response).fails() && expect(data).equals(msg);
    };
}

const runWithoutLogin = !process.env.type || process.env.type.indexOf('runWithoutLogin') > -1;
const runUser = !process.env.type || process.env.type.indexOf('runUser') > -1;
const runAdmin = !process.env.type || process.env.type.indexOf('runAdmin') > -1;

// Should fail because is without login
describe('Without Login', runWithoutLogin, () => {
    const httpWithoutLogin = HandlerHttp(BaseOptions());

    httpWithoutLogin.get('/me', null, expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.get('/users', null, expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.put('/users/1', null, expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.get('/users/1', null, expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.post('/users', null, expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.delete('/users/1', expect.fails('Proxy Authentication Required'));

    httpWithoutLogin.get('/friendships/', null, expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.get('/friendships/me', null, expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.get('/friendships/1', null, expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.post('/friendships/1', null, expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.put('/friendships/1', null, expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.delete('/friendships/1', expect.fails('Proxy Authentication Required'));
    httpWithoutLogin.get('/friendships/1/block', null, expect.fails('Proxy Authentication Required'));
});

describe('Logged as an User', runUser, () => {
    const httpUser = HandlerHttp(BaseOptions());

    httpUser.post('/login', {
        username: 'brunoaraujo1942@uol.com',
        password: 'atletico'
    }, (_data, _request, response) => {
        //Adding the cookie
        httpUser.options().headers.Cookie = response.headers['set-cookie'][0].split(';')[0] + ';';
        console.log(httpUser.options());

        // Delete should fail because miss permissions
        httpUser.delete('/users/1', (data) => {
            expect(data).equals('You need to be a Admin!');
        });

        httpUser.get('/friendships/', null, (data) => {
            expect(data.length).equals(3);
        });

        httpUser.get('/friendships/me', null, (data) => {
            expect(data.length).equals(1);
        });

        httpUser.get('/friendships/2', null, (data) => {
            expect(data.length).equals(1);
        });
    });
});


describe('Logged as an Admin', runAdmin, () => {
    const httpAdmin = HandlerHttp(BaseOptions());

    httpAdmin.post('/login', {
        username: 'admin@mail.com',
        password: 'test'
    }, (_data, _request, response) => {
        //Adding the cookie
        httpAdmin.options().headers.Cookie = response.headers['set-cookie'][0].split(';')[0] + ';';
        console.log(httpAdmin.options());

        httpAdmin.get('/me');

        httpAdmin.get('/users');

        httpAdmin.put('/users/1', null, shouldFail);

        httpAdmin.get('/users/0', null, (user) => {
            httpAdmin.put('/users/0', {
                oldPassword: user.password,
                newPassword: 'test2'
            }, () => {
                httpAdmin.put('/users/0', {
                    oldPassword: 'test2',
                    newPassword: user.password
                });
            });
        });

        httpAdmin.post('/users', {
            name: 'Alan Voiski',
            email: 'avoiski@avenuecode.com',
            password: 'nodejs'
        }, (user) => {
            httpAdmin.delete(`/users/${user._id}`);
        });
    });
});
