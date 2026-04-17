import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'importar-contatos',
    loadComponent: () =>
      import('./features/import-contacts/import-contacts.component').then((m) => m.ImportContactsComponent)
  },
  {
    path: 'tags-contatos',
    loadComponent: () =>
      import('./features/tags-contacts/tags-contacts.component').then((m) => m.TagsContactsComponent)
  },
  {
    path: 'templates',
    loadComponent: () => import('./features/templates/templates.component').then((m) => m.TemplatesComponent)
  },
  {
    path: 'disparo',
    loadComponent: () => import('./features/campaign/campaign.component').then((m) => m.CampaignComponent)
  },
  {
    path: 'manutencao',
    loadComponent: () => import('./features/maintenance/maintenance.component').then((m) => m.MaintenanceComponent)
  },
  {
    path: 'contatos-removidos',
    loadComponent: () =>
      import('./features/deleted-contacts/deleted-contacts.component').then((m) => m.DeletedContactsComponent)
  },
  {
    path: 'ferramentas',
    loadComponent: () => import('./features/tools/tools.component').then((m) => m.ToolsComponent)
  },
  {
    path: 'unsubscribe',
    loadComponent: () => import('./features/unsubscribe/unsubscribe.component').then((m) => m.UnsubscribeComponent)
  },
  { path: '**', redirectTo: '' }
];
