#!/bin/bash

# Mannequin Animation Editor - Quick Start Script

echo "🎭 Mannequin Animation Editor"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "src/editor/animation-editor.html" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "Starting local server..."
echo ""

# Check for Python
if command -v python3 &> /dev/null; then
    echo "✅ Using Python 3"
    echo "📡 Server running at: http://localhost:8000"
    echo "🌐 Open: http://localhost:8000/src/editor/animation-editor.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ Using Python 2"
    echo "📡 Server running at: http://localhost:8000"
    echo "🌐 Open: http://localhost:8000/src/editor/animation-editor.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v npx &> /dev/null; then
    echo "✅ Using npx http-server"
    echo "📡 Server running at: http://localhost:8000"
    echo "🌐 Open: http://localhost:8000/src/editor/animation-editor.html"
    echo ""
    echo "Press Ctrl+C to stop the server"
    echo ""
    npx -y http-server -p 8000
else
    echo "❌ Error: No suitable server found"
    echo ""
    echo "Please install one of the following:"
    echo "  - Python 3: sudo apt install python3"
    echo "  - Node.js: https://nodejs.org/"
    echo ""
    exit 1
fi
