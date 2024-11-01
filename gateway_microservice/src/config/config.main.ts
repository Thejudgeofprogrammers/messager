export default () => ({
    // Bootstrap
    port: parseInt(process.env.PORT, 10) || 5050,
    // AuthModule
    grpc_auth_package: process.env.GRPC_AUTH_PACKAGE.toString(),
    grpc_auth_path: process.env.GRPC_AUTH_MODULE.toString(),
    grpc_auth_url: process.env.GRPC_AUTH_URL.toString(),
    // SessionModule
    grpc_session_package: process.env.GRPC_SESSION_PACKAGE.toString(),
    grpc_session_path: process.env.GRPC_SESSION_MODULE.toString(),
    grpc_session_url: process.env.GRPC_SESSION_URL.toString(),
    // UserModule
    grpc_user_package: process.env.GRPC_USER_PACKAGE.toString(),
    grpc_user_path: process.env.GRPC_USER_MODULE.toString(),
    grpc_user_url: process.env.GRPC_USER_URL.toString(),
});
