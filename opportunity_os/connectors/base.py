from __future__ import annotations

import os
import time
from abc import ABC, abstractmethod
from typing import Any, Iterable, Optional

import httpx

from opportunity_os.normalize.schema import UnifiedListing


class BaseConnector(ABC):
    source: str = "other"

    def __init__(
        self,
        *,
        rps: float = 2.0,
        timeout: float = 30.0,
        headers: Optional[dict[str, str]] = None,
    ) -> None:
        self.rps = max(rps, 0.1)
        self._min_interval = 1.0 / self.rps
        self._last_call = 0.0
        self.timeout = timeout
        self.headers = headers or {
            "User-Agent": (
                "OpportunityOS/0.1 (+https://github.com/opportunity-os; research)"
            ),
            "Accept": "application/json",
        }
        self.client = httpx.Client(timeout=timeout, headers=self.headers, follow_redirects=True)

    def close(self) -> None:
        self.client.close()

    def __enter__(self):
        return self

    def __exit__(self, *args):
        self.close()

    def _throttle(self) -> None:
        now = time.monotonic()
        wait = self._min_interval - (now - self._last_call)
        if wait > 0:
            time.sleep(wait)
        self._last_call = time.monotonic()

    def get(self, url: str, **kwargs: Any) -> httpx.Response:
        self._throttle()
        return self.client.get(url, **kwargs)

    def post(self, url: str, **kwargs: Any) -> httpx.Response:
        self._throttle()
        return self.client.post(url, **kwargs)

    @abstractmethod
    def search(self, query: str, *, limit: int = 50) -> list[UnifiedListing]:
        raise NotImplementedError

    def search_many(self, queries: Iterable[str], *, limit: int = 50) -> list[UnifiedListing]:
        out: list[UnifiedListing] = []
        for q in queries:
            try:
                out.extend(self.search(q, limit=limit))
            except Exception as exc:  # noqa: BLE001 — collect partial
                out.append(
                    # skip bad query; callers log
                ) if False else None
                print(f"[{self.source}] search failed for {q!r}: {exc}")
        return out

    @staticmethod
    def env(name: str, default: str | None = None) -> str | None:
        return os.getenv(name, default)
