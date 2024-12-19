# API Documentation
### API Version 0.0.1

## Общая информация

- Base URL: `/`
- Все ответы возвращаются в формате JSON
- Аутентификация: JWT токен в заголовке `Authorization: Bearer <token>`
- Время жизни access token: 1 час (настраивается через JWT_EXPIRE)

## Аутентификация

### Регистрация пользователя

```http
POST /auth/register
```

Тело запроса:
```json
{
  "email": "string",
  "password": "string"
}
```

Ответ (200):
```json
{
  "id": "uuid",
  "email": "string",
  "roles": ["USER"]
}
```

### Авторизация

```http
POST /auth/login
```

Тело запроса:
```json
{
  "email": "string",
  "password": "string"
}
```

Ответ (200):
```json
{
  "accessToken": "string",  // JWT токен
  "refreshToken": {
    "token": "string",      // UUID v4
    "exp": "date",         // Срок действия (30 дней)
    "userId": "uuid"
  }
}
```

### Обновление токена

```http
POST /auth/refresh
```

Тело запроса:
```json
{
  "refreshToken": "string"  // Refresh token полученный при авторизации
}
```

## Пользователи

### Получение пользователя

```http
GET /user/:idOrEmail
```

Параметры пути:
- `idOrEmail` - UUID или email пользователя

Ответ (200):
```json
{
  "id": "uuid",
  "email": "string",
  "roles": ["string"]
}
```

### Создание пользователя

```http
POST /user
```

Тело запроса:
```json
{
  "email": "string",
  "password": "string"
}
```

### Удаление пользователя

```http
DELETE /user/:id
```

Параметры пути:
- `id` - UUID пользователя

## Коды ошибок

- 400 Bad Request - Неверный формат запроса
- 401 Unauthorized - Требуется авторизация
- 403 Forbidden - Недостаточно прав
- 404 Not Found - Ресурс не найден

## Примеры ошибок

Неверные учетные данные:
```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

Ошибка валидации:
```json
{
  "statusCode": 400,
  "message": ["password must be longer than or equal to 6 characters"],
  "error": "Bad Request"
}
```

## Безопасность

- Пароли хешируются с использованием bcrypt (salt rounds: 10)
- Используется двухтокенная система аутентификации (access + refresh tokens)
- Access token содержит: id пользователя, email и роли
- Refresh token хранится в базе данных и имеет срок действия 30 дней
