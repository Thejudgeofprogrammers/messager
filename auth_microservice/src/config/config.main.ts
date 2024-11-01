export default () => ({
    // Proto load bootstrap
    grpc_auth_url: process.env.GRPC_AUTH_URL.toString(),
    grpc_auth_main_path: process.env.GRPC_AUTH_MAIN_PATH.toString(),
    // Proto load module
    grpc_auth_package: process.env.GRPC_AUTH_PACKAGE.toString(),
    // JWT Options
    jwt_options: {
        secret: process.env.SECRET_KEY.toString(),
        expire: process.env.EXPIRE_JWT.toString(),
    },
    // AuthModule
    grpc_auth_path: process.env.GRPC_AUTH_PATH.toString(),
    // SessionModule
    grpc_session_package: process.env.GRPC_SESSION_PACKAGE.toString(),
    grpc_session_path: process.env.GRPC_SESSION_PATH.toString(),
    grpc_session_url: process.env.GRPC_SESSION_URL.toString(),
    // UserModule
    grpc_user_package: process.env.GRPC_USER_PACKAGE.toString(),
    grpc_user_path: process.env.GRPC_USER_PATH.toString(),
    grpc_user_url: process.env.GRPC_USER_URL.toString(),
});
