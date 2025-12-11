# Запуск приложения

> [!Важно]
> Для запуска понадобится докер и git

> Инструкция по запуску
> 
> `git clone https://github.com/exexeeeex/node-test-app.git`<br/>
> `cd ./node-test-app`<br/>
> `docker-compose -f ./docker-compose --verbose up --build`

## API будет доступно по адресу http://localhost:3000/api

# Маршруты
## POST `/users/sign-up`
> Регистрация

```json
{
  "email": "user@example.com",
  "password": "MySecurePass123",
  "birthday": "1990-01-15"
}
```

## POST `/users/sign-in`
>Авторизация

```json
{
  "email": "user@example.com",
  "password": "MySecurePass123"
}
```

## GET `/users/get-by-id/:userId`
>Получение пользователя по Id (UUID)
>`Требуется роль администратора/Требуется ввести свой Id`
>> `Требуется JWT токен`

## GET `/users/get-all`
>Получение всех пользователей
`Требуется роль администратора`
> `Требуется JWT токен`

## PATCH `/users/block-user/:userId` 
> Блокировка пользователя по Id (UUID)
> `Требуется роль администратора/Требуется ввести свой Id`
> `Требуется JWT токен`

## JWT токен передаётся в заголовке:
```json
'Authorization': 'Bearer token'
```

