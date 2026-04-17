import { ChangeDetectionStrategy, Component, SecurityContext, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Template } from '../../core/models/template.model';
import { TemplatesService } from '../../core/services/templates.service';
import { TemplateFormDialogComponent } from './template-form-dialog.component';

@Component({
  selector: 'app-templates',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './templates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesComponent {
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    this.search.set(input?.value ?? '');
  }

  private readonly templatesService = inject(TemplatesService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private readonly sanitizer = inject(DomSanitizer);

  readonly search = signal('');
  readonly templates = signal<Template[]>([]);
  readonly selectedTemplate = signal<Template | null>(null);

  readonly filteredTemplates = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.templates().filter((template) => template.subject.toLowerCase().includes(term));
  });

  readonly safePreview = computed(() => {
    const html = this.selectedTemplate()?.html ?? '';
    return this.sanitizer.sanitize(SecurityContext.HTML, html) ?? '';
  });

  constructor() {
    this.loadTemplates();
  }

  loadTemplates(): void {
    this.templatesService.listTemplates().subscribe((templates) => {
      this.templates.set(templates);
      this.selectedTemplate.set(templates[0] ?? null);
    });
  }

  createTemplate(): void {
    this.dialog
      .open(TemplateFormDialogComponent, { data: { mode: 'create' } })
      .afterClosed()
      .subscribe((payload) => {
        if (!payload) {
          return;
        }
        this.templatesService.createTemplate(payload).subscribe(() => {
          this.snackBar.open('Template criado com sucesso.', 'Fechar', { duration: 4000 });
          this.loadTemplates();
        });
      });
  }

  editTemplate(template: Template): void {
    this.dialog
      .open(TemplateFormDialogComponent, {
        data: { mode: 'edit', initialValue: { subject: template.subject, html: template.html } }
      })
      .afterClosed()
      .subscribe((payload) => {
        if (!payload || !template._id) {
          return;
        }
        this.templatesService.updateTemplate(template._id, payload).subscribe(() => {
          this.snackBar.open('Template atualizado.', 'Fechar', { duration: 4000 });
          this.loadTemplates();
        });
      });
  }

  deleteTemplate(template: Template): void {
    if (!template._id) {
      return;
    }

    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Excluir template',
          message: `Deseja excluir o template "${template.subject}"?`,
          confirmLabel: 'Excluir'
        }
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.templatesService.deleteTemplate(template._id!).subscribe(() => {
          this.snackBar.open('Template removido.', 'Fechar', { duration: 4000 });
          this.loadTemplates();
        });
      });
  }
}
