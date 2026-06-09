from fastapi import Request
from infrastructure.trojonetworks.dtos.user import UserProxyDto


class IdentityService:
    def __init__(self, request: Request):
        self.request: Request = request

    def get_current_user(self) -> None:
        print(self.request.cookies)
