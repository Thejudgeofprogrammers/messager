export default () => ({
    grpc_user_url: process.env.GRPC_USER_URL,
    grpc_user_path: process.env.GRPC_USER_PATH,
    more_users_find: parseInt(process.env.MORE_USERS_FIND, 10) || 50,
});
