#! /usr/bin/env bash

set -e
set -x

# Start db
python app/backend_pre_start.py

# Run migrations
alembic upgrade head