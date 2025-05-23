// Funktion zum Aktualisieren der Body-Klassen basierend auf dem aktuellen Pfad
function updateBodyClasses() {
    // Aktuelle URL-Pfad ohne Domain
    const path = window.location.pathname;

    // Entferne führende und abschließende Schrägstriche
    const cleanPath = path.replace(/^\/|\/$/g, '');

    // Entferne alle vorherigen dynamischen Klassen
    // (wir müssen eine Liste der zu entfernenden Klassen erstellen, da sich die classList während der Iteration ändert)
    const classesToRemove = [];
    for (let i = 0; i < document.body.classList.length; i++) {
        const className = document.body.classList[i];
        // Bewahre nur bestimmte MkDocs-spezifische Klassen
        if (!className.startsWith('md-') &&
            className !== 'no-js' &&
            className !== 'js') {
            classesToRemove.push(className);
        }
    }

    // Entferne die Klassen
    classesToRemove.forEach(className => {
        document.body.classList.remove(className);
    });

    // Wenn der Pfad leer oder eine Entwickler Github Page ist (Startseite), füge die Klasse 'home' hinzu
    if (cleanPath === '' || cleanPath === 'satware.ai') {
        document.body.classList.add('home');
    } else {
        // Teile den Pfad in Segmente auf
        const segments = cleanPath.split('/');

        // Füge Klassen für jedes Segment hinzu
        segments.forEach(function(segment) {
            if (segment) {
                document.body.classList.add(segment);
            }
        });
    }

    // Optional: Debug-Ausgabe in der Konsole
    console.log('Updated body classes:', document.body.className);
}

// Initial beim Laden der Seite
document.addEventListener('DOMContentLoaded', updateBodyClasses);

// Bei Navigation innerhalb der MkDocs-Seite
// Wir müssen auf das MkDocs-spezifische Event hören
document.addEventListener('DOMContentLoaded', function() {
    // Warte kurz, bis MkDocs vollständig initialisiert ist
    setTimeout(function() {
        // Finde alle internen Links
        const internalLinks = document.querySelectorAll('a[href^="/"]:not([target]), a[href^="./"]:not([target]), a[href^="../"]:not([target])');

        // Füge Event-Listener für Klicks auf interne Links hinzu
        internalLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Kurze Verzögerung, um der Navigation Zeit zu geben
                setTimeout(updateBodyClasses, 100);
            });
        });

        // Beobachte Änderungen an der URL (History API)
        if (window.MutationObserver) {
            // Beobachte Änderungen am Titel, was oft ein Indikator für Seitenwechsel ist
            const titleObserver = new MutationObserver(updateBodyClasses);
            if (document.querySelector('title')) {
                titleObserver.observe(document.querySelector('title'), { childList: true });
            }

            // Beobachte Änderungen am Hauptinhalt
            const contentObserver = new MutationObserver(function(mutations) {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        updateBodyClasses();
                        break;
                    }
                }
            });

            if (document.querySelector('.md-content')) {
                contentObserver.observe(document.querySelector('.md-content'), {
                    childList: true,
                    subtree: true
                });
            }
        }

        // Fallback: Regelmäßige Überprüfung auf URL-Änderungen
        let lastPath = window.location.pathname;
        setInterval(function() {
            if (window.location.pathname !== lastPath) {
                lastPath = window.location.pathname;
                updateBodyClasses();
            }
        }, 200);
    }, 500);
});
