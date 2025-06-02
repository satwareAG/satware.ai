# Use a Python image based on Debian (Ubuntu is derived from Debian)
FROM python:3.13-slim-bullseye

# Set the working directory inside the container
WORKDIR /docs

# Set locale to avoid potential issues with C/C++ libraries
ENV LANG C.UTF-8
ENV LC_ALL C.UTF-8

# Install system dependencies and Python packages in a single layer
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    libcairo2 \
    libffi-dev \
    libgdk-pixbuf2.0-0 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    shared-mime-info \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --no-cache-dir \
    cairosvg \
    libsass \
    mkdocs-exclude \
    mkdocs-git-revision-date-localized-plugin \
    mkdocs-glightbox \
    mkdocs-include-markdown-plugin \
    mkdocs-literate-nav \
    mkdocs-macros-plugin \
    mkdocs-material==9.6.14 \
    mkdocs-material[imaging] \
    mkdocs-minify-plugin \
    mkdocs-redirects \
    mkdocs-rss-plugin \
    mkdocs-snippets \
    mkdocs-video \
    watchdog


# No need for WORKDIR /docs or COPY package.json ./ or npm install related steps anymore
# as we're using libsass and not Node.js/npm.
