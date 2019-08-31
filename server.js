const express = require('express');
const session = require('express-session');
const knexSessionStore = require('connect-session-knex')(session);
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const secrets = require('./config/secrets.js');
const userRouter = require('./routers/user-router.js');
const authRouter = require('./routers/auth-router.js');

const sessionOptions = {
  name: 'testCookie',
  secret: secrets.AUTH_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require('./data/dbConfig.js'),
    clearInterval: 1000 * 60 * 60,
  }),
};

const server = express();
server.use(express.json());
server.use(helmet());
server.use(cors());
server.use(morgan('dev'));
server.use(session(sessionOptions));

server.use('/api', authRouter);
server.use('/api/users', userRouter);

server.get('/', (req, res) => {
  res.send(`
    <h1>WebAuth I Challenge. Looking for API Information?</h1>
    <p>Please see the <a href='https://github.com/ericlugo/webauth-iii-challenge'>README</a> for more information on where to go!</p>
  `);
});

module.exports = server;
