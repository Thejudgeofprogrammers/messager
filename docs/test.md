# Тесты api/auth

## 1. Тест для маршрута register
**Регистрация нового пользователя:**

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "newUser",
    "email": "newUser@example.com",
    "password": "newUserPassword",
    "phoneNumber": "0987654321"
  }'
```

## 2. Тест для маршрута login
**Запрос для входа с использованием email и пароля:**

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "example@example.com",
    "password": "examplePassword"
  }' \
  -c cookies.txt
```

**Запрос для входа с использованием номера телефона и пароля:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "1234567890",
    "password": "examplePassword"
  }' \
  -c cookies.txt
```
**-c cookies.txt: сохраняет куки (например, jwtToken и userId) в файл cookies.txt.**

## 3. Тест для маршрута logout
**Выход пользователя из системы:**

```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1
  }' \
  -b cookies.txt
```
**-b cookies.txt: использует куки из файла cookies.txt для аутентификации текущего сеанса пользователя.**




## 1. Поиск пользователя по ID
```bash
curl -X GET "http://localhost:8080/api/user/findById?userId=1"
```
## 2. Поиск пользователя по тегу
```bash
curl -X GET "http://localhost:8080/api/user/findByTag?tag=someTag"
```
## 3. Поиск пользователя по номеру телефона
```bash
curl -X GET "http://localhost:8080/api/user/findByPhone?phoneNumber=%2B123456789"
```
## 4. Поиск пользователя по email
```bash
curl -X GET "http://localhost:8080/api/user/findByEmail?email=test@example.com"
```
## 5. Поиск пользователя по имени пользователя
```bash
curl -X GET "http://localhost:8080/api/user/findByUsername?username=testuser"
```