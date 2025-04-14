/**
 * Initializes the mode toggle button behavior
 */

const ToggleBtn = document.querySelector('.utility-menu--toggle')
const toggleClass = ToggleBtn?.dataset.toggleClass || 'light-mode'
const soundUrl = ToggleBtn?.dataset.clickSound

export function initializeModeToggle() {
  if (!ToggleBtn) return

  // Apply saved mode from localStorage
  if (localStorage.getItem('mode') === toggleClass) {
    document.body.classList.add(toggleClass)
    ToggleBtn.setAttribute('aria-label', 'Change to dark mode')
  }

  // mode toggle click
  ToggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle(toggleClass)
    localStorage.setItem('mode', isLight ? toggleClass : '')

    // ARIA label
    ToggleBtn.setAttribute(
      'aria-label',
      isLight ? 'Change to dark mode' : 'Change to light mode'
    )

    // Sound
    if (soundUrl) {
      const audio = new Audio(soundUrl);
      audio.play().catch(err => {
        console.warn('Sound failed to play:', err);
      })
    }
    
  })
} 
