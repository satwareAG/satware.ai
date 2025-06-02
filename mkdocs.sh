#!/bin/bash
rm -r .cache
# Dirty google does no like us anymore fix
#mkdir -p .cache/plugin/social/
#cp ./docs/assets/webfonts/Roboto/*.ttf .cache/plugin/social/
# Add needed Plugins

docker build -t squidfunk/mkdocs-material ${PWD}/docker/mkdocs-material


docker run --rm -it --user $(id -u):$(id -g) -p 8000:8000 -v ${PWD}:/docs     --entrypoint sh     squidfunk/mkdocs-material-custom     -c " \
        echo 'Performing initial SCSS compilation...' && \
        pysassc overrides/assets/css/custom.scss docs/assets/css/custom.css && \
        echo 'Initial SCSS compilation complete. Starting watcher...' && \
        python /docs/scss_watcher.py & \
        echo 'SCSS watcher started. Starting MkDocs server...' && \
        mkdocs serve --dev-addr=0.0.0.0:8000 --watch overrides --watch docs --watch mkdocs.yml"
