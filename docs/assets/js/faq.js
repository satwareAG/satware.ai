// Funktion zur Initialisierung der FAQ-Funktionalität
function initFAQ() {
    // Finde alle FAQ-Fragen
    const faqQuestions = document.querySelectorAll('.custom-faq-question');

    if (faqQuestions.length === 0) {
        console.log('Keine benutzerdefinierten FAQ-Elemente gefunden');
        return;
    }

    console.log('Benutzerdefinierte FAQ-Elemente gefunden:', faqQuestions.length);

    // Entferne zuerst alle bestehenden Event-Listener, um Duplikate zu vermeiden
    faqQuestions.forEach(question => {
        // Klonen des Elements, um alle Event-Listener zu entfernen
        const newQuestion = question.cloneNode(true);
        question.parentNode.replaceChild(newQuestion, question);
    });

    // Hole die aktualisierten Elemente nach dem Klonen
    const updatedFaqQuestions = document.querySelectorAll('.custom-faq-question');

    // Füge Event-Listener zu jeder Frage hinzu
    updatedFaqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class auf der Frage
            this.classList.toggle('active');

            // Toggle active class auf der Antwort
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');

            // Wenn diese Frage geöffnet wurde, schließe alle anderen
            if (this.classList.contains('active')) {
                updatedFaqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== this && otherQuestion.classList.contains('active')) {
                        otherQuestion.classList.remove('active');
                        otherQuestion.nextElementSibling.classList.remove('active');
                    }
                });
            }
        });
    });

    console.log('Benutzerdefinierte FAQ-Funktionalität initialisiert');
}

// Führe die Initialisierung beim ersten Laden der Seite aus
document.addEventListener('DOMContentLoaded', initFAQ);

// Führe die Initialisierung aus, wenn der Inhalt der Seite durch MkDocs aktualisiert wird
document.addEventListener('DOMContentSwap', initFAQ);

// Führe die Initialisierung aus, wenn die Seite über den Material for MkDocs-Router aktualisiert wird
document.addEventListener('mdContentChanged', initFAQ);

// Führe die Initialisierung aus, wenn der Inhalt der Seite durch andere Frameworks aktualisiert wird
// MutationObserver, um Änderungen im DOM zu überwachen
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.addedNodes && mutation.addedNodes.length > 0) {
            // Prüfe, ob FAQ-Elemente hinzugefügt wurden
            for (let i = 0; i < mutation.addedNodes.length; i++) {
                const node = mutation.addedNodes[i];
                if (node.nodeType === 1 && (node.classList?.contains('custom-faq-item') ||
                    node.querySelector?.('.custom-faq-item'))) {
                    // FAQ-Elemente gefunden, initialisiere die Funktionalität
                    setTimeout(initFAQ, 100); // Kurze Verzögerung, um sicherzustellen, dass alles geladen ist
                    break;
                }
            }
        }
    });
});

// Starte die Beobachtung des Dokuments
observer.observe(document.body, {
    childList: true,
    subtree: true
});

// Zusätzlicher Event-Listener für dynamisch geladene Inhalte
window.addEventListener('load', function() {
    // Verzögerte Initialisierung, um sicherzustellen, dass alle Inhalte geladen sind
    setTimeout(initFAQ, 500);
});

// Für Material for MkDocs spezifische Ereignisse
if (typeof document$.subscribe === 'function') {
    document$.subscribe(function() {
        // Verzögerte Initialisierung, um sicherzustellen, dass alle Inhalte geladen sind
        setTimeout(initFAQ, 100);
    });
}
