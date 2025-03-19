---
layout: default
title: satware® AI chat Vorführung
permalink: /demo/
---

<div class="nextcloud-form-container">
    <iframe id="nextcloud-form" src="https://data.satware.com/apps/forms/embed/TFbCpzSJdEDzyAorS9p2mHDs" scrolling="no" frameborder="0" allowtransparency="true"></iframe>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Set initial height
    resizeIframe();
    
    // Listen for messages from the iframe content
    window.addEventListener('message', function(e) {
        // Only accept messages from the Nextcloud domain
        if (e.origin !== 'https://data.satware.com') return;
        
        // If the message contains a height, update the iframe
        if (e.data && typeof e.data === 'object' && e.data.height) {
            document.getElementById('nextcloud-form').style.height = e.data.height + 'px';
        }
    });
    
    // Fallback resize function
    function resizeIframe() {
        const iframe = document.getElementById('nextcloud-form');
        iframe.onload = function() {
            // Initial height should be at least 900px
            iframe.style.height = '900px';
            
            // Try to dynamically adjust if possible
            try {
                setInterval(function() {
                    // Try to get content height if same origin allows
                    if (iframe.contentWindow.document.body) {
                        const height = iframe.contentWindow.document.body.scrollHeight;
                        if (height > 900) {
                            iframe.style.height = height + 'px';
                        }
                    }
                }, 500);
            } catch(e) {
                // Cross-origin restrictions prevent direct height access
                console.log('Using fixed height due to cross-origin restrictions');
            }
        };
    }
});
</script>
