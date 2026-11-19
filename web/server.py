#!/usr/bin/env python3
"""Simple local web server launcher for OpportunityOS Web UI."""

import http.server
import socketserver
import os
import sys
import webbrowser

PORT = 8000
WEB_DIR = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEB_DIR, **kwargs)

def run_server(port=PORT, open_browser=True):
    os.chdir(WEB_DIR)
    handler = CustomHTTPRequestHandler
    
    with socketserver.TCPServer(("", port), handler) as httpd:
        url = f"http://localhost:{port}"
        print(f"🚀 OpportunityOS Web UI running at: {url}")
        print(f"📁 Serving static web files from: {WEB_DIR}")
        print("Press Ctrl+C to stop the server.")
        if open_browser:
            webbrowser.open(url)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else PORT
    run_server(port=port)
