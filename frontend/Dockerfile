# ./frontend/Dockerfile
FROM node:20-alpine

WORKDIR /frontend

# We mount the code via volumes in compose, so we just need to install and run.
# The "-- --host 0.0.0.0" ensures Vite binds to the Docker network, not just localhost.
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0"]
