import { CountdownOptions, CountdownTheme, I18nDictionary, TimeUnit } from './types.js';
import { ellipsesTheme } from './themes/ellipsesTheme.js';
import { i18nEN } from './i18n/en.js';
import styles from './MorphCountdown.css?inline';

export class MorphCountdown {
  private container: HTMLElement;
  private targetDate: Date;
  private theme: CountdownTheme;
  private i18n: I18nDictionary;
  private showYears: boolean;
  private showSeparators: boolean;
  private commercialLicenseKey?: string;
  private timerId: number | null = null;

  constructor(containerSelector: string | HTMLElement, options: CountdownOptions = {}) {
    this.container = typeof containerSelector === 'string'
      ? document.querySelector<HTMLElement>(containerSelector)!
      : containerSelector;

    if (!this.container) {
      throw new Error('MorphCountdown: Target container not found.');
    }

    // Looking for dat in sttributes (data-target-date or data-date-start)
    const rawTargetDate = options.targetDate 
      || this.container.getAttribute('data-target-date') 
      || this.container.getAttribute('data-date-start');

    if (!rawTargetDate) {
      throw new Error('MorphCountdown: Target date is not provided via options or data attributes.');
    }

    this.targetDate = new Date(rawTargetDate);
    this.theme = options.theme || ellipsesTheme;
    this.i18n = options.i18n || i18nEN;
    this.showYears = options.showYears ?? false;
    this.showSeparators = options.showSeparators ?? true;
    this.commercialLicenseKey = options.commercialLicenseKey;

    this.init();
  }

  private init(): void {
    this.renderMarkup();
    this.injectStyles();
    this.start();
  }

  private injectStyles(): void {
  const styleId = 'morph-countdown-global-styles';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);
    }
  }

  private renderMarkup(): void {
    const units: Array<{ key: TimeUnit; separator?: string }> = [];

    if (this.showYears) units.push({ key: 'years', separator: '/' });
    units.push({ key: 'months', separator: '/' });
    units.push({ key: 'days', separator: '-' });
    units.push({ key: 'hours', separator: ':' });
    units.push({ key: 'minutes', separator: ':' });
    units.push({ key: 'seconds' });

    const slotsHTML = units.map((item, index) => {
      const unitConfig = this.i18n[item.key];
      const slotHtml = `
        <div class="timer-slot" data-unit="${item.key}">
          <span class="slot-label">${unitConfig?.short || ''}</span>
          <div class="slot-digits-wrapper">
            <div class="svg-digit-window" data-digit-index="0">
              <svg viewBox="0 0 42 42">
                <g fill="currentColor" class="ellipse-top"></g>
                <g fill="currentColor" class="ellipse-bottom"></g>
              </svg>
            </div>
            <div class="svg-digit-window" data-digit-index="1">
              <svg viewBox="0 0 42 42">
                <g fill="currentColor" class="ellipse-top"></g>
                <g fill="currentColor" class="ellipse-bottom"></g>
              </svg>
            </div>
          </div>
        </div>
      `;

      const separatorHtml = item.separator && index < units.length - 1 && this.showSeparators
        ? `<span class="countdown-separator" aria-hidden="true">${item.separator}</span>`
        : '';

      return slotHtml + separatorHtml;
    }).join('');

    const attributionHtml = this.commercialLicenseKey
      ? ''
      : `
        <div class="morph-countdown-attribution" style="font-size:0.75rem; opacity:0.6; margin-top:0.5rem; text-align:center;">
          powered by <a href="https://github.com" target="_blank" rel="noopener noreferrer" style="color:inherit; text-decoration:underline;">morphCountdown</a>
          (<a href="https://paypal.me/YOUR_PAYPAL_HANDLE" target="_blank" rel="noopener noreferrer" style="color:inherit; opacity:0.8;">Remove link</a>)
        </div>
      `;

    this.container.innerHTML = `
      <div class="morph-countdown-wrapper">
        <div class="morph-countdown-grid" style="display:flex; align-items:center; gap:0.5rem;">
          ${slotsHTML}
        </div>
        ${attributionHtml}
      </div>
    `;
  }

  private updateUnit(unitName: TimeUnit, val: number): void {
    const slot = this.container.querySelector<HTMLElement>(`[data-unit="${unitName}"]`);
    if (!slot) return;

    const formattedVal = String(val).padStart(2, '0');
    const digitWindows = slot.querySelectorAll<HTMLElement>('.svg-digit-window');

    for (let i = 0; i < formattedVal.length; i++) {
      const windowEl = digitWindows[i];
      if (!windowEl) continue;

      const char = formattedVal[i];
      windowEl.setAttribute('data-char', char);

      const glyph = this.theme.glyphs[char] || this.theme.glyphs['0'];
      const topGroup = windowEl.querySelector<HTMLElement>('.ellipse-top');
      const bottomGroup = windowEl.querySelector<HTMLElement>('.ellipse-bottom');

      if (topGroup && bottomGroup && glyph) {
        topGroup.innerHTML = glyph.topHTML;
        bottomGroup.innerHTML = glyph.bottomHTML;
        topGroup.setAttribute('transform', glyph.matrixTop);
        bottomGroup.setAttribute('transform', glyph.matrixBottom);
      }
    }
  }

  private applyGlobalLeadingZeros(): void {
    const allWindows = this.container.querySelectorAll<HTMLElement>('.svg-digit-window');
    let isLeading = true;

    allWindows.forEach((windowEl) => {
      const char = windowEl.getAttribute('data-char');

      if (isLeading && char === '0') {
        windowEl.classList.add('is-rotating');
      } else {
        windowEl.classList.remove('is-rotating');
        if (char !== '0') {
          isLeading = false;
          return;
        }
      }
    });
  }

  private tick = (): void => {
    const now = new Date();
    const diff = this.targetDate.getTime() - now.getTime();

    if (diff <= 0) {
      this.stop();
      this.handleReleased();
      return;
    }

    const seconds = Math.floor((diff / 1000) % 60);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30);
    const months = Math.floor((diff / (1000 * 60 * 60 * 24 * 30.4375)) % 12);
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

    if (this.showYears) this.updateUnit('years', years);
    this.updateUnit('months', months);
    this.updateUnit('days', days);
    this.updateUnit('hours', hours);
    this.updateUnit('minutes', minutes);
    this.updateUnit('seconds', seconds);

    this.applyGlobalLeadingZeros();
  };

  private handleReleased(): void {
    const grid = this.container.querySelector('.morph-countdown-grid');
    if (grid) {
      grid.innerHTML = `<div class="countdown-released-status" style="font-weight:bold;">Released</div>`;
    }
  }

  public start(): void {
    this.tick();
    if (!this.timerId) {
      this.timerId = window.setInterval(this.tick, 1000);
    }
  }

  public stop(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }
}