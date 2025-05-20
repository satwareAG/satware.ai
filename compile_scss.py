import sass
import os
import time
import sys
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Pfade konfigurieren
scss_file = "overrides/assets/stylesheets/custom.scss"
css_file = "docs/stylesheets/extra.css"

def compile_scss():
    """Kompiliert SCSS zu CSS"""
    try:
        css = sass.compile(filename=scss_file, output_style='compressed')
        with open(css_file, 'w') as f:
            f.write(css)
        print(f"✅ SCSS kompiliert: {scss_file} -> {css_file}")
    except Exception as e:
        print(f"❌ Fehler bei der SCSS-Kompilierung: {e}")

class ScssChangeHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if event.src_path.endswith('.scss'):
            print(f"🔄 Änderung erkannt: {event.src_path}")
            compile_scss()

if __name__ == "__main__":
    # Erste Kompilierung durchführen
    compile_scss()

    # Überwachungsmodus, wenn als Parameter angegeben
    if len(sys.argv) > 1 and sys.argv[1] == "watch":
        print("🔍 SCSS-Dateien werden überwacht. Drücke Strg+C zum Beenden.")

        # Verzeichnis zum Überwachen
        path = os.path.dirname(scss_file)

        # Observer einrichten
        event_handler = ScssChangeHandler()
        observer = Observer()
        observer.schedule(event_handler, path, recursive=True)
        observer.start()

        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()
