export default () => ({
    // Bootstrap
    port: parseInt(process.env.PORT, 10) || 5050,
    // AuthModule
    grpc_auth_package: process.env.GRPC_AUTH_PACKAGE,
    grpc_auth_path: process.env.GRPC_AUTH_MODULE,
    grpc_auth_url: process.env.GRPC_AUTH_URL,
    // SessionModule
    grpc_session_package: process.env.GRPC_SESSION_PACKAGE,
    grpc_session_path: process.env.GRPC_SESSION_MODULE,
    grpc_session_url: process.env.GRPC_SESSION_URL,
    // UserModule
    grpc_user_package: process.env.GRPC_USER_PACKAGE,
    grpc_user_path: process.env.GRPC_USER_MODULE,
    grpc_user_url: process.env.GRPC_USER_URL,
});
