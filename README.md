chmod +x ./config/prisma.env

chmod +x ./node_modules/ts-proto/protoc-gen-ts_proto

DATABASE_URL=$(grep ^DATABASE_URL= ../config/prisma.env | cut -d '=' -f2-) npx prisma generate


Connection
Prometheus server URL *
http://prometheus:9090


npx prisma migrate dev --name init - внутри контейнера user_microservice




https://supabase.com/