import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TemplatePayload } from '../../core/models/template.model';

interface TemplateDialogData {
  mode: 'create' | 'edit';
  initialValue?: TemplatePayload;
}

@Component({
  selector: 'app-template-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.mode === 'create' ? 'Novo template' : 'Editar template' }}</h2>
    <mat-dialog-content class="dialog-content">
      <form [formGroup]="form" class="space-y-3 pt-2">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>Assunto</mat-label>
          <input matInput formControlName="subject" />
        </mat-form-field>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button mat-stroked-button type="button" (click)="htmlFileInput.click()">
            Selecionar HTML do computador
          </button>
          <input
            #htmlFileInput
            type="file"
            accept=".html,text/html"
            class="sr-only"
            aria-label="Selecionar arquivo HTML"
            (change)="onHtmlFileSelected($event)"
          />
        </div>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>HTML</mat-label>
          <textarea matInput rows="14" class="html-textarea" formControlName="html"></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="save()" [disabled]="form.invalid">Salvar</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-content {
        max-height: min(78vh, 780px);
      }

      .html-textarea {
        min-height: clamp(280px, 50vh, 560px);
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateFormDialogComponent {
  readonly data = inject<TemplateDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<TemplateFormDialogComponent, TemplatePayload>);
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    subject: [this.data.initialValue?.subject ?? '', [Validators.required]],
    html: [this.data.initialValue?.html ?? '', [Validators.required]]
  });

  onHtmlFileSelected(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const selectedFile = input.files?.item(0);
    if (!selectedFile) {
      return;
    }

    selectedFile
      .text()
      .then((content) => {
        this.form.controls.html.setValue(content);
        this.form.controls.html.markAsDirty();
        this.form.controls.html.markAsTouched();
        input.value = '';
      })
      .catch(() => {
        input.value = '';
      });
  }

  save(): void {
    if (this.form.invalid) {
      return;
    }

    this.dialogRef.close(this.form.getRawValue());
  }
}
