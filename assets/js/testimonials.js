window.addEventListener('load', function() {
    // Testimonial-Wechsel-Funktionalität
    const testimonialImages = document.querySelectorAll('.satag--home-testimonial-image-wrapper');
    const testimonialTexts = document.querySelectorAll('.satag--home-testimonials-text');

    // Funktion zum Wechseln des aktiven Testimonials
    function switchTestimonial(id) {
        // Entferne 'active' Klasse von allen Bildern und Texten
        testimonialImages.forEach(img => img.classList.remove('active'));
        testimonialTexts.forEach(text => text.classList.remove('active'));

        // Füge 'active' Klasse zum ausgewählten Bild und Text hinzu
        document.querySelector(`.satag--home-testimonial-image-wrapper[data-testimonial-id="${id}"]`).classList.add('active');
        document.querySelector(`.satag--home-testimonials-text[data-testimonial-id="${id}"]`).classList.add('active');
    }

    // Event-Listener für Klicks auf die Bilder
    testimonialImages.forEach(img => {
        img.addEventListener('click', function() {
            const id = this.getAttribute('data-testimonial-id');
            switchTestimonial(id);
        });
    });

    // Optional: Automatischer Wechsel alle 5 Sekunden
    let currentId = 1;
    const totalTestimonials = testimonialImages.length;

    function autoSwitchTestimonial() {
        currentId = currentId % totalTestimonials + 1;
        switchTestimonial(currentId);
    }

    // Kommentiere die nächste Zeile aus, wenn du keinen automatischen Wechsel möchtest
    const intervalId = setInterval(autoSwitchTestimonial, 5000);

    // Optional: Stoppe den automatischen Wechsel, wenn der Benutzer mit einem Testimonial interagiert
    testimonialImages.forEach(img => {
        img.addEventListener('click', function() {
            clearInterval(intervalId);
        });
    });
});
