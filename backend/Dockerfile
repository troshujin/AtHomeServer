# ./backend/Dockerfile
FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /backend

CMD ["bash", "-c", "uv sync && uv run python main.py"]
