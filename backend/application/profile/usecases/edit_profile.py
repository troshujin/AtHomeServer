import base64
from urllib.parse import urlencode

from starlette.responses import RedirectResponse

from core.common.result import Result, succeed
from core.configuration import config


class EditProfileUseCase:
    """
    Profile details (name, email, password) live on the trojonetworks
    identity, not in this app - so "edit profile" is a plain redirect to the
    network's own profile page, with a `back` param (same urlsafe-base64
    shape the login flow sends) pointing at our profile page so the user
    lands back where they started.
    """

    async def __call__(self) -> Result[RedirectResponse]:
        back = (
            base64.urlsafe_b64encode(f"{config.auth.FRONTEND_URL}/profile".encode())
            .decode()
            .rstrip("=")
        )

        params = urlencode({"back": back})
        edit_url = (
            f"{config.auth.LOGIN_BASE_URL}/networks/{config.auth.NETWORK_ID}/profile?{params}"
        )

        return succeed(RedirectResponse(url=edit_url))
