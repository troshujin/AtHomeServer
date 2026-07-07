from fastapi import Response

SESSION_COOKIE = "session_id"

# Deliberately NOT httpOnly - the frontend reads this to decide whether it's
# worth calling `/me` at all, so an anonymous visitor doesn't get bounced
# through the 401/403 redirect on every page load. Never trust it for
# authorization - the real session_id cookie is what every permission check
# actually validates.
SESSION_HINT_COOKIE = "session_hint"


def set_session_cookies(response: Response, session_id: str, expires_in: int) -> None:
    response.set_cookie(
        key=SESSION_COOKIE,
        value=session_id,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=expires_in,
    )
    response.set_cookie(
        key=SESSION_HINT_COOKIE,
        value="1",
        httponly=False,
        secure=True,
        samesite="lax",
        max_age=expires_in,
    )


def clear_session_cookies(response: Response) -> None:
    response.delete_cookie(key=SESSION_COOKIE, secure=True, samesite="lax")
    response.delete_cookie(key=SESSION_HINT_COOKIE, secure=True, samesite="lax")
