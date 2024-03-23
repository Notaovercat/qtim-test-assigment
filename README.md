[![My Skills](https://skillicons.dev/icons?i=nodejs,nestjs,postgres,redis)](https://skillicons.dev)
# QTIM-test
Тестовое задание на позицию  Node.js Разработчика в QTIM

## Подготовка
### Требования
```bash
npm i -g pnpm
```
### Установка зависимостей
```bash
pnpm i
```
### Переменные окружения
.env для api
```bash
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password
POSTGRES_DB=nestjs

JWT_SECRET=secret
JWT_EXPIRES_IN=3600

REDIS_HOST=localhost
REDIS_PORT=6379
```

docker.env для docker-compose
```bash
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=postgres_password
POSTGRES_DB=nestjs
```

## Запуск
### Запуск необходимых сервисов
```bash
docker-compose up -d
```
### Запуск миграций
```bash
pnpm run migration:generate
pnpm run migration:run
```
### Запуск в dev режиме
```bash
pnpm run start:dev
```
### Запуск в prod режиме
```bash
pnpm run build
pnpm run start:prod
```
### Дополнительно
API доступно по адресу: http://localhost:3000/api/v1

Документация доступна по адресу: http://localhost:3000/docs

