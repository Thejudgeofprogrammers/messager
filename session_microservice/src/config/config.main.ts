export default () => ({
    // DataBase Redis
    redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
    grpc_session_url: process.env.GRPC_SESSION_URL,
    grpc_session_package: process.env.GRPC_SESSION_PACKAGE,
    grpc_session_path: process.env.GRPC_SESSION_PATH,
});
