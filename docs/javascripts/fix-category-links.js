// Fix für Blog-Kategorielinks bei MkDocs Material
document.addEventListener('DOMContentLoaded', function() {
  // Prüfen, ob wir uns auf einer Kategorie-Seite befinden
  if (window.location.pathname.includes('/blog/category/')) {
    console.log('Blog Category page detected - checking links...');
    
    // Alle Post-Links finden
    const postLinks = document.querySelectorAll('.md-post__content h2 a, .md-post__action a');
    
    postLinks.forEach(function(link) {
      const href = link.getAttribute('href');
      
      // Prüfen, ob der Link category/ im Pfad enthält
      if (href && (href.includes('/category/') || href.includes('category/'))) {
        console.log('Fixing link:', href);
        
        // Link korrigieren indem 'category/' entfernt wird
        const fixedHref = href.replace(/\/?category\//, '/');
        link.setAttribute('href', fixedHref);
      }
    });
  }
});