# Xsolla School 2021. Backend
Это тестовое задание для отбора в **Xsolla School**. Написано на node.js, используется фреймворк Fastify, а также Postgres в качестве базы данных. Предполагается использование в первую очердь в качестве docker образа, поэтому конфигурация происходит через переменные окружения.

| Имя           | По умолчанию | Описание                       |
|:-------------:|:------------:|:------------------------------:|
| `DB_HOST`     | `0.0.0.0`    | адрес postgres                 |
| `DB_PORT`     | `5432`       | порт postgres                  |
| `DB_NAME`     |              | имя базы данных в postgres     |
| `DB_USER`     |              | имя пользователя postgres      |
| `DB_PASSWORD` |              | пароль пользователя postgres   |
| `PORT`        | `3000`       | порт, где будет слушать сервер |
| `API_PREFIX`  | `/api/v1`    | префикс api                    |

## Описание api
Если запрос обладает не пустым телом, `content-type` запроса должен быть `application/json`, а тело дожно быть `json` объектом с полями указанными в спецификации api за исключением тех полей, которые явно передаются в `query` или `params`, например, `id`.

Ответ сервера всегда содержит `json` объект, в котором:
-   всегда есть поле `statusCode`, которое дублирует код ответа
-   иногда при ошибке есть поле `error`, которое содержит название ошибки
-   всегда при ошибке есть поле `message`, которое содержит сообщение ошибки
-   остальные поля зависят от типа запроса

Сервер отвечает с кодом:
-   `200`, если операция прошла успешно
-   `404`, если не удалось что-либо найти
-   `4xx` и `5xx`, если произошла необычная ошибка

### `POST /api/v1/products`
Создаёт новый продукт и возвращает его идентификатор в поле `id`.

| Параметр | Тип       | Обязательный | По умолчанию |
|:--------:|:---------:|:------------:|:------------:|
| `sku`    | `string`  | да           |              |
| `name`   | `string`  | нет          | `''`         |
| `type`   | `string`  | нет          | `''`         |
| `price`  | `integer` | нет          | `1000000000` |

### `GET /api/v1/products?<query>`
Возвращает список продуктов в поле `products`, основываясь на переданных параметрах, например, только продукты определённого типа.

| Параметр | Тип       | Обязательный |
|:--------:|:---------:|:------------:|
| `type`   | `string`  | нет          |
| `offset` | `integer` | нет          |
| `limit`  | `integer` | нет          |


### `GET /api/v1/products/<id>`
Возвращает продукт по его идентификатору в поле `product`.

| Параметр | Тип       | Обязательный |
|:--------:|:---------:|:------------:|
| `id`     | `integer` | да           |

### `PUT /api/v1/products/<id>`
Изменяет продукт по его идентификатору.

| Параметр | Тип       | Обязательный |
|:--------:|:---------:|:------------:|
| `id`     | `integer` | да           |
| `sku`    | `string`  | нет          |
| `name`   | `string`  | нет          |
| `type`   | `string`  | нет          |
| `price`  | `integer` | нет          |

### `DELETE /api/v1/products/<id>`
Удаляет продукт по его идентификатору.

| Параметр | Тип       | Обязательный |
|:--------:|:---------:|:------------:|
| `id`     | `integer` | да           |

## Как запускать
Первым дело необходимо склонировать репозиторий и перейти в его директорию:
```sh
git clone https://github.com/zcimrn/xsolla
cd xsolla
```

### Используя node.js
Сначала нужно установить все зависимости проекта:
```sh
npm ci
```
Далее нужно установить переменные окружения, после чего можно смело запускать проект:
```sh
node main.js
```

### Используя docker
Сначала нужно собрать образ, используя `Dockerfile`:
```sh
docker build --rm -t xsolla .
```
Теперь можно запускать собранный образ, не забыв указать переменные окружения:
```sh
docker run --rm --name xsolla -e "<установка переменных окружения>" -d xsolla
```

### Используя docker-compose
Можно адаптировать файл `compose.yml` под свои нужды, а можно воспользоваться им, чтобы в тестовом режиме поглядеть на проект:
```sh
docker-compose up --build -d
```

## Как использовать (примеры с curl)
После запуска можно обращаться по указанному адресу, например, используя curl.

Будем считать, что сервер запущен на `0.0.0.0:80`.

### `POST /api/v1/products`
```sh
curl -s -X POST "0.0.0.0/api/v1/products" \
    -H "content-type: application/json" \
    -d '{"sku": "some sku", "name": "some name", "type": "some type", "price": 31337}'
```

### `GET /api/v1/products?<query>`
```sh
curl -s -X GET "0.0.0.0/api/v1/products?type=some%20type&offset=0&limit=1"
```

### `GET /api/v1/products/<id>`
```sh
curl -s -X GET "0.0.0.0/api/v1/products/1"
```

### `PUT /api/v1/products/<id>`
```sh
curl -s -X PUT "0.0.0.0/api/v1/products/1" \
    -H "content-type: application/json" \
    -d '{"sku": "some new sku", "name": "some new name", "type": "some new type", "price": 13}'
```

### `DELETE /api/v1/products/<id>`
```sh
curl -s -X DELETE "0.0.0.0/api/v1/products/1"
```
