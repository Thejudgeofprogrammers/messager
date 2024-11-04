export default () => ({
    // Proto load bootstrap
    grpc_auth_url: process.env.GRPC_AUTH_URL,
    // Proto load module
    grpc_auth_package: process.env.GRPC_AUTH_PACKAGE,
    // JWT Options
    jwt_options: {
        secret: process.env.SECRET_KEY,
        expire: process.env.EXPIRE_JWT,
    },
    // AuthModule
    grpc_auth_path: process.env.GRPC_AUTH_PATH,
    // SessionModule
    grpc_session_package: process.env.GRPC_SESSION_PACKAGE,
    grpc_session_path: process.env.GRPC_SESSION_PATH,
    grpc_session_url: process.env.GRPC_SESSION_URL,
    // UserModule
    grpc_user_package: process.env.GRPC_USER_PACKAGE,
    grpc_user_path: process.env.GRPC_USER_PATH,
    grpc_user_url: process.env.GRPC_USER_URL,
});
