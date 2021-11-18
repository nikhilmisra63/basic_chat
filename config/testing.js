module.exports = {
  db: {
    username: 'root',
    database: 'chat',
    setting: {
      host: 'localhost',
      port: '3306',
      dialect: 'mysql',
      pool: {
        max: 1000,
        min: 0,
        idle: 10000,
        acquire: 10000
      },
      dialectOptions: {
        decimalNumbers: true,
        supportBigNumbers: true,
        bigNumberStrings: true
      },
      replication: {
        read: [{ host: 'localhost', username: 'root', password: 'Dkod3@123' }],
        write: { host: 'localhost', username: 'root', password: 'Dkod3@123' }
      },
      logging: false
    }
  },
  port: 5500,
  isTesting: true
};
