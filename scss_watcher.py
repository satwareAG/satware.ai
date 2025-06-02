import time
import subprocess
import os
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class ScssEventHandler(FileSystemEventHandler):
    """
    Handles file system events to recompile SCSS on changes.
    """
    def on_modified(self, event):
        """
        Called when a file or directory is modified.
        """
        if event.is_directory:
            return

        # Define source and destination paths relative to the WORKDIR /docs
        scss_source_path = "overrides/assets/css/custom.scss"
        css_dest_path = "docs/assets/css/custom.css"

        # Check if the modified file is the custom.scss file we care about
        # We need to be careful with event.src_path as it might be an absolute path
        # or relative to where the watcher was started.
        # A more robust check is to see if the event path ends with our source path.
        if event.src_path.endswith(scss_source_path):
            print(f"Detected change in {event.src_path}. Compiling SCSS...")
            print(f"Source SCSS: {scss_source_path}")
            print(f"Destination CSS: {css_dest_path}")
            try:
                # Execute the SCSS compilation command
                result = subprocess.run([
                    "pysassc",
                    scss_source_path,
                    css_dest_path
                ], capture_output=True, text=True, check=True)

                print("SCSS compilation command output:")
                print("STDOUT:", result.stdout)
                print("STDERR:", result.stderr)
                print("SCSS compiled successfully.")

                # --- NEW: Verify content of the compiled CSS file ---
                if os.path.exists(css_dest_path):
                    with open(css_dest_path, 'r') as f:
                        content = f.read()
                        print(f"Content of {css_dest_path} (first 200 chars):\n{content[:200]}...")
                else:
                    print(f"Error: Compiled CSS file not found at {css_dest_path}")
                # --- END NEW ---

            except subprocess.CalledProcessError as e:
                print(f"Error compiling SCSS: {e}")
                print("STDOUT:", e.stdout)
                print("STDERR:", e.stderr)
            except FileNotFoundError:
                print("Error: 'sass' command not found. Make sure libsass is installed and in PATH.")
            except Exception as e:
                print(f"An unexpected error occurred during SCSS compilation: {e}")

if __name__ == "__main__":
    # Define the path to watch (the directory containing custom.scss)
    # This path is relative to the WORKDIR /docs inside the container
    path_to_watch = os.path.join("overrides", "assets", "css")

    # Ensure the path exists before starting the watcher
    if not os.path.exists(path_to_watch):
        print(f"Error: Directory '{path_to_watch}' not found. Please ensure the path to custom.scss is correct relative to /docs.")
        exit(1)

    event_handler = ScssEventHandler()
    observer = Observer()
    # Schedule the observer to watch the specified path without recursion
    observer.schedule(event_handler, path_to_watch, recursive=False)
    observer.start()
    print(f"Watching for changes in {path_to_watch}...")
    try:
        # Keep the observer running until interrupted
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("SCSS watcher stopped.")
    observer.join()

