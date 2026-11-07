import './styles.css';
import { MorphCountdown } from '../src/index.ts';

// timer
const targetDate = new Date(Date.now() + 48 * 60 * 60 * 1000); // +48 hours
/* const countdown = */ new MorphCountdown('#countdown-root', {
  targetDate: targetDate,
  //theme: 'leaf',
  showBranding: true
});
/** 
globalThis.getElementById('countdown-target').appendChild(countdown.element);

// Swith theme
globalThis.querySelectorAll('.theme-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    globalThis.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    
    const theme = e.target.dataset.theme;
    countdown.setTheme(theme);
  });
});
*/
async function loadDonors() {
  const grid = globalThis.getElementById('donors-grid');
  try {
    const response = await fetch('../donors.json');
    const donors = await response.json();
    
    if (donors.length === 0) {
      grid.innerHTML = '<p class="donor-card">Be the first supporter!</p>';
      return;
    }

    grid.innerHTML = donors.map(donor => `
      <div class="donor-card">
        ${donor.name}
        <span>${donor.tier} • ${donor.date}</span>
      </div>
    `).join('');
  } catch (e) {
    grid.innerHTML = '<p class="donor-card">Could not load Wall of Fame.</p>';
  }
}

loadDonors();