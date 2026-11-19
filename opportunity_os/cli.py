"""CLI entrypoint for OpportunityOS."""

from __future__ import annotations

from pathlib import Path
from typing import Optional

import typer
from rich import print as rprint
from rich.table import Table

from opportunity_os.connectors.registry import list_apis, registry_summary
from opportunity_os.pipeline.run import run_pipeline
from opportunity_os.utils.config import root_path

app = typer.Typer(help="OpportunityOS — PW1 Product Opportunity Hub", no_args_is_help=True)


@app.command("apis")
def apis_cmd(marketplace: Optional[str] = typer.Option(None, "--market", "-m")):
    """List registered marketplace APIs."""
    summary = registry_summary()
    rprint("[bold]API registry[/bold]", summary)
    rows = list_apis(marketplace)
    table = Table(title=f"APIs ({marketplace or 'all'})")
    table.add_column("id")
    table.add_column("kind")
    table.add_column("method")
    table.add_column("pw1")
    for a in rows:
        table.add_row(
            a.get("id", ""),
            a.get("kind", ""),
            a.get("method", ""),
            ", ".join(a.get("pw1") or [])[:40],
        )
    rprint(table)


@app.command("run")
def run_cmd(
    har: Optional[Path] = typer.Option(None, "--har", help="Path to Etsy HAR"),
    live_etsy: bool = typer.Option(False, "--live-etsy", help="Also call Etsy Open API"),
):
    """Run full ingest → score → train pipeline."""
    summary = run_pipeline(har_path=har, use_live_etsy=live_etsy)
    rprint("[green]Done[/green]")
    rprint(f"Listings: {summary['listings']}")
    rprint(f"Opportunities: {summary['opportunities']}")
    rprint(f"Report: {summary['report']}")
    rprint(f"Train: {summary['train']}")
    if summary.get("top"):
        rprint("\n[bold]Top 3[/bold]")
        for t in summary["top"][:3]:
            rprint(
                f"  {t['recommendation']:5} {t['opportunity_score']:5.1f}  "
                f"{t['product_type']} | {t['niche']}"
            )


@app.command("ping-etsy")
def ping_etsy():
    """Ping Etsy Open API (needs ETSY_API_KEY=keystring:secret)."""
    import os
    import httpx

    key = os.getenv("ETSY_API_KEY") or os.getenv("ETSY_KEYSTRING")
    if not key:
        rprint("[red]Set ETSY_API_KEY=keystring:shared_secret[/red]")
        raise typer.Exit(1)
    # Docs use api.etsy.com for ping
    url = "https://api.etsy.com/v3/application/openapi-ping"
    r = httpx.get(url, headers={"x-api-key": key}, timeout=30)
    rprint(r.status_code, r.text)


@app.command("web")
def web_cmd(port: int = typer.Option(8000, "--port", "-p", help="Port to serve web UI on")):
    """Launch OpportunityOS Landing Page & Web UI."""
    from web.server import run_server
    run_server(port=port)


if __name__ == "__main__":
    app()
