"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = __importDefault(require("./config/database")); // Import default export
const logger_1 = __importDefault(require("./utils/logger"));
async function startServer() {
    try {
        console.log('🚀 Starting AquaGlow Backend...');
        console.log(`📁 Environment: ${env_1.config.NODE_ENV}`);
        // Test database connection
        await database_1.default.authenticate();
        console.log('✅ Database connection established');
        // Load models
        console.log('🔄 Loading models...');
        await Promise.resolve().then(() => __importStar(require('./models/index')));
        // Sync database models (create tables if they don't exist)
        console.log('🔄 Syncing database...');
        await database_1.default.sync({
            alter: env_1.config.NODE_ENV === 'development',
            force: false // NEVER set to true in production
        });
        console.log('✅ Database synchronized');
        // Create and start Express app
        const app = (0, app_1.createApp)();
        const server = app.listen(env_1.config.PORT, () => {
            console.log('\n' + '='.repeat(50));
            console.log('🎉 AquaGlow Backend Started Successfully!');
            console.log('='.repeat(50));
            console.log(`📡 Port: ${env_1.config.PORT}`);
            console.log(`🌐 API URL: http://localhost:${env_1.config.PORT}/api`);
            console.log(`🏥 Health Check: http://localhost:${env_1.config.PORT}/health`);
            console.log(`👤 Database User: ${env_1.config.DB_USER}`);
            console.log(`🗄️  Database: ${env_1.config.DB_NAME}`);
            console.log(`🏠 Database Host: ${env_1.config.DB_HOST}:${env_1.config.DB_PORT}`);
            console.log('='.repeat(50) + '\n');
            logger_1.default.info(`Server running on port ${env_1.config.PORT}`);
        });
        // Graceful shutdown
        const shutdown = async (signal) => {
            console.log(`\n${signal} received: shutting down gracefully...`);
            logger_1.default.info(`${signal} signal received`);
            server.close(async () => {
                console.log('✅ HTTP server closed');
                try {
                    await database_1.default.close();
                    console.log('✅ Database connection closed');
                    logger_1.default.info('Server shutdown complete');
                    process.exit(0);
                }
                catch (error) {
                    console.error('❌ Error closing database:', error);
                    process.exit(1);
                }
            });
            // Force shutdown after 10 seconds
            setTimeout(() => {
                console.error('❌ Could not close connections in time, forcing shutdown');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => shutdown('SIGTERM'));
        process.on('SIGINT', () => shutdown('SIGINT'));
    }
    catch (error) {
        console.error('\n❌ Failed to start server!');
        console.error('='.repeat(50));
        console.error('Error:', error.message);
        if (error.name === 'SequelizeConnectionError') {
            console.error('\n🔧 Database Connection Troubleshooting:');
            console.error('1. Is PostgreSQL running? Check with:');
            console.error('   Windows: services.msc → Look for PostgreSQL');
            console.error('   Command: net start | findstr PostgreSQL');
            console.error('2. Check .env file credentials:');
            console.error(`   DB_HOST: ${env_1.config.DB_HOST}`);
            console.error(`   DB_PORT: ${env_1.config.DB_PORT}`);
            console.error(`   DB_NAME: ${env_1.config.DB_NAME}`);
            console.error(`   DB_USER: ${env_1.config.DB_USER}`);
            console.error(`   DB_PASSWORD: ${env_1.config.DB_PASSWORD ? '*****' : 'NOT SET'}`);
            console.error('3. Test connection manually:');
            console.error(`   psql -h ${env_1.config.DB_HOST} -U ${env_1.config.DB_USER} -d ${env_1.config.DB_NAME}`);
        }
        console.error('='.repeat(50));
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Start the server
startServer();
//# sourceMappingURL=server.js.map