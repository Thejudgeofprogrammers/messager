export default () => ({
    // DataBase Redis
    redis: {
        host: process.env.REDIS_HOST.toString(),
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
    // Proto load bootstrap
    grpc_session_url: process.env.GRPC_SESSION_URL.toString(),
    grpc_session_main_path: process.env.GRPC_SESSION_MAIN_PATH.toString(),
    // Proto load module
    grpc_session_package: process.env.GRPC_SESSION_PACKAGE.toString(),
    grpc_session_path: process.env.GRPC_SESSION_PATH.toString(),
});
