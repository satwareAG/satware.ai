#!/bin/sh
rm -r .cache
# Dirty google does no like us anymore fix
#mkdir -p .cache/plugin/social/
#cp ./docs/assets/webfonts/Roboto/*.ttf .cache/plugin/social/
# Add needed Plugins
docker build -t squidfunk/mkdocs-material ${PWD}/docker/mkdocs-material
# Liveserver Dokumentation
docker run --rm -it --user $(id -u):$(id -g) -p 8000:8000 -v ${PWD}:/docs squidfunk/mkdocs-material