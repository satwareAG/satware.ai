#!/bin/bash
# Optimiertes Skript zum Erstellen von Bildern in verschiedenen Größen und Formaten für Manjaro
# Behebt die aufgetretenen Fehler

# Konfigurierbare Variablen
QUALITY_JPG=85
QUALITY_WEBP=85
QUALITY_AVIF=85  # Geändert auf einen Wert unter 64
TINY_QUALITY=20
SIZES=(200 400 800)
INPUT_PATH="assets/img/team/jane-alesi.jpg"
OUTPUT_PATH="assets/img/team"

# Prüfen ob bc installiert ist und ggf. installieren
if ! command -v bc &> /dev/null; then
    echo "bc wird benötigt. Installiere..."
    sudo pacman -S --noconfirm bc
fi

# Funktionen
create_sized_images() {
    local source="$1"
    local output_base="$2"
    local width="$3"
    local height="$4"
    
    # Verhältnis berechnen
    local ratio=$(echo "scale=10; $height/$width" | bc)
    
    # Für jede Größe
    for size in "${SIZES[@]}"; do
        local new_height=$(echo "scale=0; $size*$ratio/1" | bc)
        
        echo "Creating ${size}x${new_height} versions..."
        
        # JPG-Version (mit magick statt convert)
        magick "$source" -resize "${size}x${new_height}" -quality $QUALITY_JPG "${output_base}-${size}.jpg"
        
        # WebP-Version
        cwebp -q $QUALITY_WEBP -resize $size $new_height "$source" -o "${output_base}-${size}.webp"
        
        # AVIF-Version mit korrigierten Parametern
        if command -v avifenc &> /dev/null; then
            avifenc -s $size -s $new_height --min 0 --max 63 --speed 6 --jobs 8 -a end-usage=q -a cq-level=$QUALITY_AVIF "$source" "${output_base}-${size}.avif"
        fi
    done
    
    # Vollständige Versionen
    echo "Creating full-size versions..."
    magick "$source" -quality $QUALITY_JPG "${output_base}.jpg"
    cwebp -q $QUALITY_WEBP "$source" -o "${output_base}.webp"
    
    if command -v avifenc &> /dev/null; then
        avifenc --min 0 --max 63 --speed 6 --jobs 8 -a end-usage=q -a cq-level=$QUALITY_AVIF "$source" "${output_base}.avif"
    fi
    
    # Tiny LQIP-Version für Placeholder
    echo "Creating tiny placeholder..."
    magick "$source" -resize "60x" -blur 0x2 -quality $TINY_QUALITY "${output_base}-tiny.jpg"
}

# Hauptprogramm
echo "Starting image optimization..."

# Installieren aller benötigten Pakete
echo "Prüfe und installiere benötigte Pakete..."
for pkg in imagemagick libwebp libavif bc; do
    if ! pacman -Qi $pkg &> /dev/null; then
        echo "Installiere $pkg..."
        sudo pacman -S --noconfirm $pkg
    fi
done

# Original-Bildinformationen extrahieren
DIMENSIONS=$(magick identify -format "%wx%h" "$INPUT_PATH")
WIDTH=$(echo $DIMENSIONS | cut -d'x' -f1)
HEIGHT=$(echo $DIMENSIONS | cut -d'x' -f2)

echo "Original dimensions: ${WIDTH}x${HEIGHT}"

# Ausgangs-Dateiname ohne Erweiterung
FILENAME=$(basename "$INPUT_PATH" .jpg)
OUTPUT_BASE="${OUTPUT_PATH}/${FILENAME}"

# Bilder erstellen
create_sized_images "$INPUT_PATH" "$OUTPUT_BASE" "$WIDTH" "$HEIGHT"

echo "Image optimization complete!"
