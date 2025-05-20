# satwareai-mkdocs

A documentation website for satware.ai built with MkDocs and the Material for MkDocs theme.

## Overview

This project contains the source files for the satware.ai documentation website. It uses MkDocs as the static site generator and the Material for MkDocs theme for styling and enhanced functionality.

## Setup and Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/satware-ag/satwareai-mkdocs.git
   cd satwareai-mkdocs
   ```


2. Create and activate a virtual environment:

   ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3. Install the dependencies:

  ```bash
    pip install -r requirements.txt
  ```


## Development

To start the development server:


```bash
./dev.sh
```

Or manually:

```bash
mkdocs serve
```


This will start a local development server at [http://127.0.0.1:8000/](http://127.0.0.1:8000/) that automatically reloads when you make changes to the documentation.

### SCSS Compilation

The project uses SCSS for styling. To compile SCSS files to CSS:



```bash
python compile_scss.py
```

## Building the Site

To build the static site:


```bash
mkdocs build
```

This will create a `site` directory with the built static site.


## Theme Customization

The site uses the Material for MkDocs theme with custom overrides located in the `docs/overrides` directory. Additional styling is provided through SCSS files in the `docs/stylesheets` directory.

## Documentation

For more information about MkDocs and the Material for MkDocs theme, refer to:

- [MkDocs Documentation](https://www.mkdocs.org/getting-started/)
- [Material for MkDocs Documentation](https://squidfunk.github.io/mkdocs-material/getting-started/)