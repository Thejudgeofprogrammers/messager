chmod +x ./config/prisma.env

chmod +x ./node_modules/ts-proto/protoc-gen-ts_proto

DATABASE_URL=$(grep ^DATABASE_URL= ../config/prisma.env | cut -d '=' -f2-) npx prisma generate

// Нужно будет разобраться как билдить проект если node_modules у меня во внешней папке


// разобраться с импортами package в родительских модулях
// разобраться с регистрацией