(function () {
  const body = document.body;
  const menuBtn = document.querySelector('.menu-btn');
  const dropdown = document.querySelector('.nav-dropdown');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      body.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', body.classList.contains('nav-open') ? 'true' : 'false');
    });
  }

  document.querySelectorAll('nav a').forEach((link) => {
    link.addEventListener('click', () => {
      body.classList.remove('nav-open');
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      body.classList.remove('nav-open');
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  if (dropdown) {
    dropdown.addEventListener('click', (event) => {
      if (window.innerWidth <= 860 && event.target.closest('.nav-dropdown > a')) {
        event.preventDefault();
        dropdown.classList.toggle('open');
      }
    });
  }
})();
