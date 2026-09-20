/**
 * RemoSIM - Modern Client Scripts
 * Theme Toggle, Mobile Navigation, and Code Copying
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getActiveTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return prefersDark.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
    localStorage.setItem('theme', theme);
  }

  // Initialize theme
  applyTheme(getActiveTheme());

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // 2. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
  }

  // 3. Code Block Copy Buttons
  document.querySelectorAll('pre').forEach((pre) => {
    if (pre.querySelector('.copy-code-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'copy-code-btn';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.innerHTML = '<i class="far fa-copy"></i> Copy';

    btn.addEventListener('click', async () => {
      const code = pre.querySelector('code');
      const textToCopy = code ? code.innerText : pre.innerText;

      try {
        await navigator.clipboard.writeText(textToCopy);
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        btn.style.opacity = '1';
        setTimeout(() => {
          btn.innerHTML = '<i class="far fa-copy"></i> Copy';
          btn.style.opacity = '';
        }, 2000);
      } catch (err) {
        console.error('Failed to copy code: ', err);
      }
    });

    pre.style.position = 'relative';
    pre.appendChild(btn);
  });
});
