'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
console.log('process.env.NODE_ENV is' + process.env.NODE_ENV + 'wao');
console.log('env is' + env + 'wao');
const config = require(__dirname + '/../config/config.json')[env];
console.log('config is ' + config + 'wawa');
console.log('config.use_env_variable is  ' + config.use_env_variable);

const db = {};

let sequelize;
if (config.use_env_variable) {
  console.log('use_env');
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log('currnetEnv: ' + env);
  if (env === 'development') {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      config
    );
  } else if (env == 'production') {
    sequelize = new Sequelize(
      config.database,
      config.username,
      config.password,
      // set cloudsql
      {
        dialect: 'postgres',
        host: '/cloudsql/semiotic-axis-363920:us-central1:todoappinstance',
        dialectOptions: {
          socketPath:
            'cloudsql/semiotic-axis-363920:us-central1:todoappinstance',
        },
      },
      config
    );
  }
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
