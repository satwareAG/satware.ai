// assets/js/infinite-scroll.js
document.addEventListener('DOMContentLoaded', () => {
  const blogGrid = document.querySelector('.blog-grid');
  const loadMoreButton = document.querySelector('.load-more');
  let currentPage = 1;
  const totalPages = parseInt(loadMoreButton.dataset.totalPages);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && currentPage < totalPages) {
        loadMorePosts();
      }
    });
  });

  if (loadMoreButton) {
    observer.observe(loadMoreButton);
  }

  async function loadMorePosts() {
    currentPage++;
    const response = await fetch(`/page${currentPage}`);
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const newPosts = doc.querySelector('.blog-grid').innerHTML;
    
    blogGrid.insertAdjacentHTML('beforeend', newPosts);

    if (currentPage >= totalPages) {
      loadMoreButton.remove();
      observer.disconnect();
    }
  }
});