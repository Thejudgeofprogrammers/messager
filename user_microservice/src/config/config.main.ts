export default () => ({
    // Proto load bootstrap
    grpc_user_url: process.env.GRPC_USER_URL.toString(),
    grpc_user_path_main: process.env.GRPC_USER_PATH_MAIN.toString(),
    // Proto load module
    grpc_user_package: process.env.GRPC_USER_PACKAGE.toString(),
    grpc_user_path: process.env.GRPC_USER_PATH.toString(),
    // How many user finding
    more_users_find: parseInt(process.env.MORE_USERS_FIND, 10) || 50,
});
