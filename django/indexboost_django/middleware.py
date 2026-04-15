"""
IndexBoost Render middleware for Django.

Intercepts requests from known crawlers and serves rendered HTML from
render.getindexboost.com instead of letting Django process them.

Usage:

    # settings.py
    MIDDLEWARE = [
        "indexboost_django.middleware.IndexBoostMiddleware",
        # ... existing middleware
    ]

    INDEXBOOST_TOKEN = env("INDEXBOOST_TOKEN")
"""

from __future__ import annotations

import re
import urllib.parse
import urllib.request
from http.client import HTTPResponse
from typing import Callable

from django.conf import settings
from django.http import HttpRequest, HttpResponse


CRAWLERS_PATTERN: re.Pattern[str] = re.compile(
    r"googlebot|bingbot|gptbot|claudebot|perplexitybot|duckduckbot|slurp|"
    r"naverbot|yandexbot|baiduspider|facebookexternalhit|twitterbot|"
    r"linkedinbot|whatsapp|telegrambot|applebot|rogerbot|semrushbot|"
    r"ahrefsbot|bytespider|dotbot|mj12bot|pinterestbot",
    re.IGNORECASE,
)

STATIC_EXTENSIONS_PATTERN: re.Pattern[str] = re.compile(
    r"\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|otf|"
    r"pdf|zip|xml|map|txt|json|csv|gz|br)$",
    re.IGNORECASE,
)

DEFAULT_SERVICE_URL = "https://render.getindexboost.com"


class IndexBoostMiddleware:
    """
    Django middleware that intercepts crawler requests and returns
    rendered HTML from the IndexBoost render service.
    """

    def __init__(self, get_response: Callable[[HttpRequest], HttpResponse]) -> None:
        self.get_response = get_response
        self.token: str | None = getattr(settings, "INDEXBOOST_TOKEN", None)
        self.service_url: str = getattr(
            settings, "INDEXBOOST_SERVICE_URL", DEFAULT_SERVICE_URL
        ).rstrip("/")
        self.enabled: bool = getattr(settings, "INDEXBOOST_ENABLED", True)
        self.timeout: int = getattr(settings, "INDEXBOOST_TIMEOUT", 30)
        self.ignored_paths: list[re.Pattern[str]] = [
            re.compile(p)
            for p in getattr(settings, "INDEXBOOST_IGNORED_PATHS", [r"^/api/", r"^/admin/"])
        ]

    def __call__(self, request: HttpRequest) -> HttpResponse:
        if not self._should_render(request):
            return self.get_response(request)

        rendered = self._fetch_rendered(request)
        if rendered is None:
            return self.get_response(request)

        response = HttpResponse(rendered, content_type="text/html; charset=utf-8")
        response["X-IndexBoost-Rendered"] = "true"
        response["Cache-Control"] = "public, max-age=3600"
        return response

    # ── Helpers ───────────────────────────────────────────────────────────────

    def _should_render(self, request: HttpRequest) -> bool:
        if not self.enabled or not self.token:
            return False

        if request.method not in ("GET", "HEAD"):
            return False

        if STATIC_EXTENSIONS_PATTERN.search(request.path):
            return False

        for pattern in self.ignored_paths:
            if pattern.search(request.path):
                return False

        ua = request.META.get("HTTP_USER_AGENT", "")
        return bool(CRAWLERS_PATTERN.search(ua))

    def _fetch_rendered(self, request: HttpRequest) -> str | None:
        ua = request.META.get("HTTP_USER_AGENT", "")
        full_url = request.build_absolute_uri()
        render_url = f"{self.service_url}/?url={urllib.parse.quote(full_url, safe='')}"

        req = urllib.request.Request(
            render_url,
            headers={
                "X-INDEXBOOST-TOKEN": self.token or "",
                "X-Original-User-Agent": ua,
            },
        )

        try:
            with urllib.request.urlopen(req, timeout=self.timeout) as resp:  # type: HTTPResponse
                if resp.status != 200:
                    return None
                return resp.read().decode("utf-8", errors="replace")
        except Exception:
            return None
