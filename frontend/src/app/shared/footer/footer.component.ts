import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-info">
          <p>&copy; {{ currentYear }} WeatherSystem. {{ t('footer.rights') }}</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--card-bg);
      border-top: 1px solid var(--card-border);
      padding: 1.5rem 2rem;
      margin-top: 2rem;
      color: var(--text-muted);
    }
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer-info p { margin: 0; font-size: 0.875rem; }
    .footer-links { display: flex; gap: 1.5rem; font-size: 1.25rem; }
    .footer-links a { color: var(--text-muted); transition: color 0.2s; }
    .footer-links a:hover { color: var(--primary-color); }
    @media (max-width: 600px) {
      .footer-content { flex-direction: column; gap: 1rem; text-align: center; }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  constructor(private i18n: TranslationService) {}

  t(key: string): string {
    return this.i18n.translate(key);
  }
}
