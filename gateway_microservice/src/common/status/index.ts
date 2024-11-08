export const StatusClient = {
    HTTP_STATUS_OK: { message: 'OK', status: 200 as number },
    HTTP_STATUS_BAD_REQUEST: { message: 'Bad Request', status: 400 as number },
    HTTP_STATUS_NOT_FOUND: { message: 'Not Found', status: 404 as number },
    HTTP_STATUS_INTERNAL_SERVER_ERROR: {
        message: 'Internal Server Error',
        status: 500 as number,
    },
};
