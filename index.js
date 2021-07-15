const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '.env') });
const Sequelize = require('sequelize');
const helmet = require('helmet');
const cors = require('cors');
const socketIO = require('socket.io');
const HTTP = require('http');
const morgan = require('morgan');
const config = require('config');
const serverUtils = require('./utils/serverUtils');
global.app = express();
global.Op = Sequelize.Op;

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
/* istanbul ignore next */
app.use(morgan('tiny'));
const http = HTTP.createServer(app);

const db = config.get('db');
global.sequelize = new Sequelize(db.database, null, null, db.setting);
const routes = require('./routes');

// server up
const startApp = async () => {
  app.use('/', routes);

  // error handler
  app.use((err, req, res, next) => {
    if (!config.get('isTesting')) {
      console.log(err);
    }
    if (!err.statusCode && config.get('isTesting')) {
      return res.status(500).send({ error: err.stack });
    }
    if (!err.statusCode) {
      return res.status(500).send({ message: err.message });
    }

    if (config.get('isTesting')) {
      res.status(err.statusCode).send({ message: err.message });
    } else {
      res.status(err.statusCode).send({ message: err.message });
    }
  });
  global.io = socketIO(http);
  require('./socket.io');
  global.server = http.listen(config.get('port'), () => {
    console.log(`Welcome To ${config.get('APP_NAME')} ${config.get('port')}`);
  });
};

if (config.get('isTesting')) {
  startApp();
} else {
  serverUtils.boot(app).then(
    () => {
      console.log('Starting index.js - starting app from last else');
      startApp();
    },
    (err) => {
      console.error(err);
    }
  );
}

module.exports = app;
