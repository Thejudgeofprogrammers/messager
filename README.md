# Telegram

## Команды для запуска
- chmod +x .
- npm run dev:build

**Под команды для бд**
- docker exec -it user_microservice sh
- npx prisma migrate dev --name init - внутри контейнера user_microservice

## ELK
- Connection Prometheus server URL * http://prometheus:9090

## Задачи:

### Aws Or yandex.cloud
- add method for upload avatar to chat
- add method for upload avatar for user


- реализовать метод отправки приглашений в чат

### Websocket
- реализовать пойск chat и user по маске имени
- При каждом действии с чатом будь то удаление пользователя выход пользователь и тд. Создавалось новое сообщение в чате