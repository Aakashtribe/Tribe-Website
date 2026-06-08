(function initComingSoonModal() {
  const modal = document.getElementById('coming-soon-modal');
  if (!modal) return;

  function openComingSoonModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (typeof closeMobileMenu === 'function') closeMobileMenu();
  }

  function closeComingSoonModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  window.openComingSoonModal = openComingSoonModal;
  window.closeComingSoonModal = closeComingSoonModal;

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-coming-soon]');
    if (trigger) {
      e.preventDefault();
      openComingSoonModal();
    }
  });

  modal.querySelectorAll('[data-close-modal]').forEach((el) => {
    el.addEventListener('click', closeComingSoonModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeComingSoonModal();
  });
})();
