---
layout: default
title: satware® AI chat Zugang buchen
permalink: /order/
---

## satware® AI chat Zugang

Erweitern Sie Ihre Fähigkeiten mit unserer fortschrittlichen KI-Technologie. Füllen Sie das Formular aus, um Ihren persönlichen Zugang zu erhalten.

## Persönlichen Zugang anfordern
{: #order-form}

<div class="google-form-container">
    <iframe id="google-form" src="https://docs.google.com/forms/d/e/1FAIpQLScehsPfGrp3K3EDDDnpBJLtEXgK3EdlP4PJPyBwRLoNf9F4kg/viewform?embedded=true&theme=dark" width="640" height="3100" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
</div>

<script>
// Order page enhancements
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        // Only run on the order page
        if (document.getElementById('order-form')) {
            // Add floating button for mobile
            const floatingButton = document.createElement('a');
            floatingButton.href = '#order-form';
            floatingButton.className = 'back-to-form';
            floatingButton.textContent = 'Zugang anfordern';
            document.body.appendChild(floatingButton);
            
            // Handle Google Form loading
            const googleForm = document.getElementById('google-form');
            if (googleForm) {
                googleForm.addEventListener('load', function() {
                    const formContainer = document.querySelector('.google-form-container');
                    if (formContainer) {
                        formContainer.classList.add('form-loaded');
                    }
                });
            }
        }
    });
})();

</script>