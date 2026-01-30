"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const sequelize_1 = require("sequelize");
const env_1 = require("./env");
const sequelize = new sequelize_1.Sequelize(env_1.config.DB_NAME, env_1.config.DB_USER, env_1.config.DB_PASSWORD, {
    host: env_1.config.DB_HOST,
    port: env_1.config.DB_PORT,
    dialect: 'postgres',
    logging: env_1.config.NODE_ENV === 'development' ? console.log : false,
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
        throw error;
    }
};
exports.testConnection = testConnection;
exports.default = sequelize;
//# sourceMappingURL=database.js.map