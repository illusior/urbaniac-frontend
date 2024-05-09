### Базовое использование

##### Заметка: использовать эти команды из корня проекта

##### Заметка: переменные среды из .env файлов доступны ТОЛЬКО во время жизни самого контейнера, не на этапах билда образа

#### Сборка образа с помощью Dockerfile:

```
docker build --target <image_name> -t <result_image_name> -f .\.docker\build.Dockerfile .
```

- <image_name> - stage name в [Dockerfile](./Dockerfile)
- <result_image_name> - имя собранного образа(результата)

e.g.

1. соборка dev-образа:

```
docker build --target dev -t name -f .\.docker\Dockerfile .
```

2. сборка preview-образа:

```
docker build --target preview -t name -f .\.docker\Dockerfile .
```

#### Запуск образов

```
docker run -d --rm -p <FRONTEND_HOST_PORT>:<image_port> <image_name>
```

- <FRONTEND_HOST_PORT> - порт, который займёт образ докера на вашей машине
- <image_port> - порт образа, открытый с помощью `EXPOSE`, проверьте [Dockerfile](./.Dockerfile), чтобы узнать, какие порты открыты у образов

#### Сборка образа с помощью **docker compose**:

Поднять контейнеризированный сервис

```
docker compose --env-file <dot-env-filepath> -f .\.docker\compose.yml up --build --wait <service_name>
```

- <dot-env-filepath> - путь к `.env` файлу
- <service_name> - имя сервиса, определённого в [`compose.yml`](./compose.yml)

##### <a name="compose-watch"></a> Работающий контейнер, синхронизированный с вашей локальной файловой системой проекта

После `compose up` сервиса, который имеет `develop-->watch` секции в своём `compose.yml`

```
docker compose -f .\.docker\compose.yml alpha watch [<service_name>]
```

- <service_name> - имя сервиса, который должен быть синхронизирован [`compose.yml`](./compose.yml)

### пример docker compose up + watch

Запуск multi-container:

```
docker compose -f .\.docker\compose.yml up --build --wait frontend
```

После этого вы сможете видеть запущенный контейнер

Запуск watch:

```
docker compose -f .\.docker\compose.yml watch frontend
```

После этого любые изменения в хостовском ./src/ будут синхронизированы в контейнеровском ./src/
Также доступна полная пересборка образа при изменении [`package.json`](./../package.json) файла
