import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactsService } from '../../core/services/contacts.service';

@Component({
  selector: 'app-import-contacts',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule
  ],
  templateUrl: './import-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportContactsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactsService = inject(ContactsService);
  private readonly snackBar = inject(MatSnackBar);

  readonly tags = signal<string[]>([]);
  readonly form = this.fb.nonNullable.group({
    contacts: ['', [Validators.required, Validators.minLength(5)]],
    tagInput: ['']
  });

  addTagFromInput(rawValue: string): void {
    const value = rawValue.trim().toLowerCase();
    if (!value || this.tags().includes(value)) {
      return;
    }

    this.tags.update((list) => [...list, value]);
    this.form.controls.tagInput.setValue('');
  }

  removeTag(tag: string): void {
    this.tags.update((list) => list.filter((item) => item !== tag));
  }

  async loadFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (!file) {
      return;
    }

    const content = await file.text();
    const current = this.form.controls.contacts.value;
    const joiner = current ? '\n' : '';
    this.form.controls.contacts.setValue(`${current}${joiner}${content}`);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.contactsService
      .importContacts({
        contacts: this.form.controls.contacts.value,
        tags: this.tags()
      })
      .subscribe(() => {
        this.snackBar.open('Contatos importados com sucesso.', 'Fechar', { duration: 4000 });
        this.form.controls.contacts.setValue('');
        this.tags.set([]);
      });
  }
}
