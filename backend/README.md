# Project Tracker - Backend
## Requirements
- Docker.
- uv for Python package and environment management.
## General Workflow
Dependencies are managed with [uv](https://docs.astral.sh/uv/).

From `./backend/` dependencies can be installed with:

```shell
uv sync
```

Then activate the virutal environment with:
```shell
source .venv/bin/activate
```

## Backend tests
To test the backend run:

```shell
bash ./scripts/test.sh
```

The tests run with Pytest from `./backend/tests/` folder.

### Test Coverage
When the tests are run, a file `htmlcov/index.html` is generated, it can be opened in browser to see the coverage of the tests.