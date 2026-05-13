import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from core.common.exception import CustomException
from web.endpoints import router

logger = logging.getLogger("uvicorn.error")


def create_app() -> FastAPI:
    app = FastAPI(
        title="AtHomeServer API",
        description="My local home server backend",
        version="0.1.0",
    )

    app.include_router(router)

    @app.exception_handler(CustomException)
    async def _(_: Request, exc: CustomException):
        logger.error(f"Handled CustomException:\n{exc.get_trace()}")
        return JSONResponse(
            status_code=exc.http_code,
            content=exc.to_dict(),
        )

    return app


app = create_app()
