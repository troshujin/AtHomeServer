.PHONY: run-backend run-frontend run-containers install-all install-env install-frontend install-backend install-setup-certs

run-backend:
	cd backend && uv run uvicorn main:app --reload

run-frontend:
	cd frontend && npm run dev

run-containers:
	docker compose up --build

install-all: install-env install-setup-certs install-backend install-frontend
	@echo Installation complete! Update your .env file, then run 'make run-containers'.

install-env:
	@if not exist .env ( copy backend/.env.example backend/.env >nul & echo Created .env from .env.example. ) else ( echo .env already exists, skipping. )

install-backend:
	@echo Syncing Python dependencies...
	cd backend && uv sync

install-frontend:
	@echo Installing Node dependencies...
	cd frontend && npm install

install-setup-certs:
	@echo Generating local SSL certificates...
	mkcert -install
	@if not exist deploy\certs mkdir deploy\certs
	mkcert -cert-file deploy/certs/localhost.pem -key-file deploy/certs/localhost-key.pem localhost "*.localhost" myapp.localhost