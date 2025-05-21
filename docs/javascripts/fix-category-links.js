// Fix für Blog-Kategorielinks
document.addEventListener('DOMContentLoaded', function() {
  // Prüfen, ob wir uns auf einer Kategorie-Seite befinden
  if (window.location.pathname.includes('/blog/category/')) {
    // Alle Post-Links auf der Kategorie-Seite finden
    const postLinks = document.querySelectorAll('.md-post__content a, .md-post__action a');
    
    postLinks.forEach(function(link) {
      const href = link.getAttribute('href');
      
      // Prüfen, ob der Link fälschlicherweise '/category/' im Pfad enthält
      if (href && href.includes('/category/') && !href.endsWith('.html')) {
        // Link korrigieren indem der category/ Teil entfernt wird
        const fixedHref = href.replace('/category/', '/');
        link.setAttribute('href', fixedHref);
        
        // Zur Sicherheit auch die URL im Titel korrigieren
        const title = link.getAttribute('title');
        if (title && title.startsWith('Weiterlesen:')) {
          link.setAttribute('title', title);
        }
      }
    });
  }
});