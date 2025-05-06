document.addEventListener('DOMContentLoaded', function() {
    // Finde alle FAQ-Fragen
    const faqQuestions = document.querySelectorAll('.custom-faq-question');

    if (faqQuestions.length === 0) {
        console.log('Keine benutzerdefinierten FAQ-Elemente gefunden');
        return;
    }

    console.log('Benutzerdefinierte FAQ-Elemente gefunden:', faqQuestions.length);

    // Füge Event-Listener zu jeder Frage hinzu
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            // Toggle active class auf der Frage
            this.classList.toggle('active');

            // Toggle active class auf der Antwort
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');

            // Wenn diese Frage geöffnet wurde, schließe alle anderen
            if (this.classList.contains('active')) {
                faqQuestions.forEach(otherQuestion => {
                    if (otherQuestion !== this && otherQuestion.classList.contains('active')) {
                        otherQuestion.classList.remove('active');
                        otherQuestion.nextElementSibling.classList.remove('active');
                    }
                });
            }
        });
    });

    console.log('Benutzerdefinierte FAQ-Funktionalität initialisiert');
});
