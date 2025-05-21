// Fix for blog category links
document.addEventListener('DOMContentLoaded', function() {
  // Check if we're on a category page
  if (window.location.pathname.includes('/blog/category/')) {
    // Find all post links inside the category page
    const postLinks = document.querySelectorAll('.md-posts__title a, .md-posts__continue a');
    
    postLinks.forEach(function(link) {
      const href = link.getAttribute('href');
      
      // Check if the link incorrectly includes /category/ in its path
      if (href && href.includes('/blog/category/') && !href.endsWith('.html')) {
        // Fix the link by replacing the incorrect path with the correct one
        const fixedHref = href.replace('/blog/category/', '/blog/');
        link.setAttribute('href', fixedHref);
      }
    });
  }
});