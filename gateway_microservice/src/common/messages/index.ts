export const errMessages = {
    registry: 'Occurred when user registration failed',
    login: 'An error occurred while trying to login',
    logout: 'An error occurred while logout',

    findByUsername: 'Error in findUserByUsername',
    findByEmail: 'Error in findUserByEmail',
    findByPhone: 'Error in findUserByPhone',
    findByTag: 'Error in findUserByTag',
    findUserById: 'Error in findUserById',

    createNewChat: 'Error occurred while creating a new chat',
    getChatById: 'Error occurred while fetching chat by ID',
    getChatByChatName: 'Error occurred while fetching chat by name',
    updateChatById: 'Error occurred while updating chat by ID',
    deleteChatById: 'Error occurred while deleting chat by ID',
    getAllChats: 'Error occurred while fetching all chats',
    addUserToChat: 'Error occurred while adding user to chat',
    removeUserFromChat: 'Error occurred while removing user from chat',

    use: {
        sessionInvalid: 'Invalid session',
        sessionValidate: 'Failed to validate session',
    },

    notFound: {
        user: 'User not found',
        chat: 'Chat not found',
    },
};
