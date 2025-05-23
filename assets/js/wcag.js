document.addEventListener('DOMContentLoaded', function() {
    const scrollWrap = document.querySelector('.md-search__scrollwrap');

    if (scrollWrap) {
        scrollWrap.setAttribute('tabindex', '0');

        scrollWrap.addEventListener('keydown', function(e) {
            // Pfeiltasten für Scrolling
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.scrollTop += 30;
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.scrollTop -= 30;
            } else if (e.key === 'PageDown') {
                e.preventDefault();
                this.scrollTop += this.clientHeight;
            } else if (e.key === 'PageUp') {
                e.preventDefault();
                this.scrollTop -= this.clientHeight;
            } else if (e.key === 'Home') {
                e.preventDefault();
                this.scrollTop = 0;
            } else if (e.key === 'End') {
                e.preventDefault();
                this.scrollTop = this.scrollHeight;
            }
        });
    }
});