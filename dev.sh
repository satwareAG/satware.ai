#!/bin/zsh
# Start SCSS Watcher und MkDocs-Server in parallelen Prozessen

# Stelle sicher, dass wir in der virtuellen Umgebung sind
if [[ "$VIRTUAL_ENV" == "" ]]; then
    echo "Virtuelle Umgebung nicht aktiviert. Bitte führe aus:"
    echo "source venv/bin/activate"
    exit 1
fi

# Initial kompilieren
python compile_scss.py

# Starte SCSS-Watcher im Hintergrund
python compile_scss.py watch &
SCSS_PID=$!

# Starte MkDocs-Server
mkdocs serve --dev-addr=0.0.0.0:8000

# Stoppe den SCSS-Watcher, wenn der Server beendet wird
kill $SCSS_PID
