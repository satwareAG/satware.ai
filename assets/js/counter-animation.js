document.addEventListener('DOMContentLoaded', function() {
    // Funktion zum Formatieren der Zahlen mit Kommas und Plus-Zeichen
    function formatNumber(num, includePlus = true) {
        const formatted = num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        return includePlus ? formatted + '+' : formatted;
    }

    // Funktion zum Extrahieren der Zahl aus dem Text (entfernt das '+' und Kommas)
    function extractNumber(text) {
        return parseInt(text.replace(/,/g, '').replace('+', ''), 10);
    }

    // Funktion zum Animieren der Zähler
    function animateCounter(counterElement, target) {
        // Startpunkt
        let start = 0;
        // Dauer der Animation in Millisekunden (angepasst an die Größe der Zahl)
        const duration = Math.min(2000 + Math.log10(target) * 300, 3000);
        // Zeitpunkt des Starts
        const startTime = performance.now();

        // Funktion für die Animation
        function updateCounter(currentTime) {
            // Berechne den verstrichenen Zeitanteil (0 bis 1)
            const elapsedTime = Math.min((currentTime - startTime) / duration, 1);

            // Easing-Funktion für eine natürlichere Animation
            const progress = easeOutQuart(elapsedTime);

            // Berechne den aktuellen Wert
            const currentValue = Math.floor(progress * target);

            // Aktualisiere den Zähler mit dem Plus-Zeichen
            counterElement.textContent = formatNumber(currentValue, true);

            // Wenn die Animation noch nicht abgeschlossen ist, nächsten Frame anfordern
            if (elapsedTime < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Stelle sicher, dass der endgültige Wert exakt dem Zielwert entspricht
                counterElement.textContent = formatNumber(target, true);
            }
        }

        // Easing-Funktion für eine natürlichere Animation
        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        // Starte die Animation
        requestAnimationFrame(updateCounter);
    }

    // Intersection Observer zum Erkennen, wann die Zähler sichtbar werden
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Wenn der Zähler sichtbar wird
            if (entry.isIntersecting) {
                const counterElement = entry.target;
                // Extrahiere die Zielnummer aus dem Text
                const targetText = counterElement.textContent;
                const target = extractNumber(targetText);

                // Setze den Anfangswert auf 0 mit Plus-Zeichen
                counterElement.textContent = '0+';

                // Starte die Animation
                animateCounter(counterElement, target);

                // Beobachtung beenden, damit die Animation nur einmal ausgeführt wird
                observer.unobserve(counterElement);
            }
        });
    }, {
        threshold: 0.1 // 10% des Elements müssen sichtbar sein
    });

    // Alle Zähler beobachten
    document.querySelectorAll('.satag--home-counter-number').forEach(counter => {
        observer.observe(counter);
    });
});
