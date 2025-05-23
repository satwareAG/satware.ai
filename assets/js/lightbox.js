// Lightbox functionality for the homepage screenshot

document.addEventListener('DOMContentLoaded', function() {
  // Get the screenshot image
  const screenshotImg = document.querySelector('.screenshot-container img');

  // If the image exists
  if (screenshotImg) {
    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.className = 'satag-lightbox';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'satag-lightbox-close';
    closeBtn.innerHTML = '&times;';

    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'satag-lightbox-img';
    lightboxImg.src = screenshotImg.src;
    lightboxImg.alt = screenshotImg.alt;

    // Append elements to the lightbox
    lightbox.appendChild(closeBtn);
    lightbox.appendChild(lightboxImg);

    // Remove any existing lightbox to avoid duplicates
    const existingLightbox = document.querySelector('.satag-lightbox');
    if (existingLightbox) {
      document.body.removeChild(existingLightbox);
    }

    // Append lightbox to the body instead of the screenshot container
    // This allows the lightbox to be as large as the viewport, not constrained by the container
    document.body.appendChild(lightbox);

    // Function to position the lightbox directly over the original image
    function positionLightbox() {
      // Get the position and dimensions of the original image
      const imgRect = screenshotImg.getBoundingClientRect();
      const screenshotContainer = document.querySelector('.screenshot-container');
      const containerRect = screenshotContainer.getBoundingClientRect();

      // Get the current scroll position
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Position the lightbox directly over the original image
      lightbox.style.position = 'fixed';
      lightbox.style.top = imgRect.top + 'px';
      lightbox.style.left = imgRect.left + 'px';
      lightbox.style.width = imgRect.width + 'px';
      lightbox.style.height = imgRect.height + 'px';
      lightbox.style.display = 'flex';
      lightbox.style.alignItems = 'center';
      lightbox.style.justifyContent = 'center';

      // Set the lightbox image to fill the lightbox container
      lightboxImg.style.position = 'relative';
      lightboxImg.style.width = '100%';
      lightboxImg.style.height = '100%';
      lightboxImg.style.objectFit = 'contain';

      // Position the close button in the top-right corner of the lightbox
      closeBtn.style.top = '5px';
      closeBtn.style.right = '5px';
    }

    // Function to check if lightbox should be enabled (screen width > 768px)
    function shouldEnableLightbox() {
      return window.innerWidth > 768;
    }

    // Update cursor style based on screen width
    function updateCursorStyle() {
      screenshotImg.style.cursor = shouldEnableLightbox() ? 'pointer' : 'default';
    }

    // Initial cursor style update
    updateCursorStyle();

    // Update cursor style when window is resized
    window.addEventListener('resize', updateCursorStyle);

    // Open lightbox when clicking on the screenshot (only if screen width > 768px)
    screenshotImg.addEventListener('click', function(e) {
      e.preventDefault(); // Prevent default behavior

      // Only activate lightbox if screen width > 768px
      if (!shouldEnableLightbox()) {
        return;
      }

      // Position the lightbox over the original image
      positionLightbox();

      // Display the lightbox - use flex to match our CSS
      lightbox.style.display = 'flex';

      // Force a reflow to ensure the display change takes effect before adding the active class
      void lightbox.offsetWidth;

      // Apply transform scale to the lightbox to make it larger
      const viewportWidth = window.innerWidth;
      if (viewportWidth <= 479) { // Mobile
        lightbox.style.transform = 'scale(1.2)';
      } else if (viewportWidth <= 959) { // Tablet
        lightbox.style.transform = 'scale(1.3)';
      } else if (viewportWidth <= 1219) { // Medium screens
        lightbox.style.transform = 'scale(1.4)';
      } else { // Large screens
        lightbox.style.transform = 'scale(1.5)';
      }

      // Add the active class to trigger the transition
      lightbox.classList.add('active');
    });

    // Function to handle closing with transition
    function closeLightboxWithTransition() {
      lightbox.style.opacity = '0';
      lightbox.style.transform = 'scale(1)'; // Reset scale to original size

      // Wait for transition to complete before removing active class
      setTimeout(function() {
        lightbox.classList.remove('active');

        // Reset display to none after the transition is complete
        lightbox.style.display = 'none';

        // Reset all inline styles after the lightbox is hidden
        setTimeout(function() {
          // Reset opacity and transform
          lightbox.style.opacity = '';
          lightbox.style.transform = '';

          // Reset position and size styles
          lightbox.style.position = '';
          lightbox.style.top = '';
          lightbox.style.left = '';
          lightbox.style.width = '';
          lightbox.style.height = '';
          lightbox.style.alignItems = '';
          lightbox.style.justifyContent = '';

          // Reset image styles
          lightboxImg.style.width = '';
          lightboxImg.style.height = '';
          lightboxImg.style.objectFit = '';

          // Reset close button styles
          closeBtn.style.top = '';
          closeBtn.style.right = '';
        }, 100);
      }, 400); // Match the transition duration from CSS
    }

    // Close lightbox when clicking on the close button
    closeBtn.addEventListener('click', function(e) {
      e.stopPropagation(); // Prevent event from bubbling up
      closeLightboxWithTransition();
    });

    // Close lightbox when clicking on the lightbox (outside the image)
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightboxWithTransition();
      }
    });

    // Close lightbox when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightboxWithTransition();
      }
    });

    // Update lightbox position when window is resized
    window.addEventListener('resize', function() {
      if (lightbox.classList.contains('active')) {
        // Reposition the lightbox based on new viewport dimensions
        positionLightbox();

        // Apply appropriate transform scale based on viewport width
        const viewportWidth = window.innerWidth;
        if (viewportWidth <= 479) { // Mobile
          lightbox.style.transform = 'scale(1.2)';
        } else if (viewportWidth <= 959) { // Tablet
          lightbox.style.transform = 'scale(1.3)';
        } else if (viewportWidth <= 1219) { // Medium screens
          lightbox.style.transform = 'scale(1.4)';
        } else { // Large screens
          lightbox.style.transform = 'scale(1.5)';
        }
      }
    });
  }
});
