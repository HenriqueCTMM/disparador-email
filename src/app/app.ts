import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LoadingService } from './core/services/loading.service';

interface NavItem {
  path: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);

  readonly navItems: NavItem[] = [
    { path: '', label: 'Dashboard', icon: 'dashboard' },
    { path: 'importar-contatos', label: 'Importar Contatos', icon: 'upload_file' },
    { path: 'tags-contatos', label: 'Tags & Contatos', icon: 'sell' },
    { path: 'templates', label: 'Templates', icon: 'description' },
    { path: 'disparo', label: 'Disparo', icon: 'send' },
    { path: 'manutencao', label: 'Manutenção', icon: 'build' },
    { path: 'contatos-removidos', label: 'Removidos', icon: 'person_off' },
    { path: 'ferramentas', label: 'Ferramentas', icon: 'settings' }
  ];

  readonly isLoading = this.loadingService.isLoading;
  readonly pageTitle = computed(() => {
    const current = this.navItems.find((item) => `/${item.path}` === this.router.url);
    return current?.label ?? 'Disparador de E-mails';
  });
}
