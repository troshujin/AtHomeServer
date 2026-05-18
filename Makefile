.PHONY: run-backend run-frontend run-containers install-all install-env install-frontend install-backend install-setup-certs

run-backend:
	uv run uvicorn main:app --reload

run-frontend:
	cd web/app && npm run dev

run-containers:
	docker compose up --build

install-all: install-env install-setup-certs install-backend install-frontend
	@echo Installation complete! Update your .env file, then run 'make run-containers'.

install-env:
	@if not exist .env ( copy .env.example .env >nul & echo Created .env from .env.example. ) else ( echo .env already exists, skipping. )

install-backend:
	@echo Syncing Python dependencies...
	uv sync

install-frontend:
	@echo Installing Node dependencies...
	cd web/app && npm install

install-setup-certs:
	@echo Generating local SSL certificates...
	mkcert -install
	@if not exist web\certs mkdir web\certs
	mkcert -cert-file web/certs/localhost.pem -key-file web/certs/localhost-key.pem localhost
