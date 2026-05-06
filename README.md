# Full Stack Project Tracker

## Stack
[Docker](https://www.docker.com/) - контейниризация.
### Backend Stack
- [FastAPI](https://fastapi.tiangolo.com) - фреймворк для API бэкенда на Python. Код написан синхронно;
- [PostgreSQL](https://www.postgresql.org) - база данных SQL;
- [Pydantic](https://docs.pydantic.dev) - используется FastAPI, инструмент для валидации данных и управления настройками;
- [SQLModel](https://sqlmodel.tiangolo.com) - ORM для взаимодействия с БД. От разработчика FastAPI, поэтому проще интеграция. (На основе [ORM SQLAlchemy](https://www.sqlalchemy.org/) и [Pydantic](https://docs.pydantic.dev));
- [Alembic](https://alembic.sqlalchemy.org/en/latest/) - инструмент от разработчиков SQLAlchemy для миграций БД;
- [Pytest](https://pytest.org) - для тестов;
- [uv](https://docs.astral.sh/uv/) - современный инструмент для сборки и управления зависимостями написанный на Rust;
- [ruff](https://docs.astral.sh/ruff/) и [ty](https://docs.astral.sh/ty/) - для форматирования и линтинга кода в соответствии со стандартами PEP 8;
- [mypy](https://www.mypy-lang.org/) - статическая типизация.

### Frontend Stack
- [React](https://react.dev) - frontend фреймворк;
- Typescript;
- [Vite](https://vitejs.dev) - инструмент для сборки;
- [Material UI](https://mui.com/material-ui/) - стили;
- [Orval](https://orval.dev/) - генератор клиента из OpenAPI схемы;
- [Axios](https://axios.rest/) - HTTP клиент.

## Testing
Для тестирования запустить скрипт `./scripts/test.sh`. По умолчанию он удаляет все данные из БД.

## Startup
Для запуска проекта необходимо склонировать проект и запустить Docker compose в папке проекта:
```shell
git clone https://github.com/fistos3rr/fullstack-project-tracker.git
cd fullstack-project-tracker
docker compose up
```
По умолчанию backend и frontend запускаются на портах 8000 и 5173 соответственно.
После запуска веб доступен по адресу `http://localhost:5173`.

OpenAPI docs по адресу `http://localhost:8000/docs`.