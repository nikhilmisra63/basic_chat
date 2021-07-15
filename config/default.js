module.exports = {
  db: {
    username: 'root',
    database: process.env.DB_NAME,
    setting: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'mysql',
      pool: {
        max: 1000,
        min: 0,
        idle: 10000,
        acquire: 10000
      },
      dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true,
        decimalNumbers: true
      },
      replication: {
        read: [
          {
            host: process.env.DB_HOST,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD
          }
        ],
        write: {
          host: process.env.DB_HOST,
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD
        }
      },
      logging: false
    }
  },
  port: 4300,
  isTesting: false,
  version: 'v1',
  accessTokenLength: 64,
  APP_NAME: 'CHAT'
};
