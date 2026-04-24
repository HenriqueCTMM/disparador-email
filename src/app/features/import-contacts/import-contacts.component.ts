import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ContactsService } from '../../core/services/contacts.service';
import { Tag } from '../../core/models/tag.model';
import { TagsService } from '../../core/services/tags.service';

@Component({
  selector: 'app-import-contacts',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    CdkTextareaAutosize,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './import-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImportContactsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactsService = inject(ContactsService);
  private readonly tagsService = inject(TagsService);
  private readonly snackBar = inject(MatSnackBar);

  @ViewChild('contactsTextarea')
  private readonly contactsTextarea?: ElementRef<HTMLTextAreaElement>;

  readonly tags = signal<Tag[]>([]);
  readonly form = this.fb.nonNullable.group({
    contacts: ['', [Validators.required, Validators.minLength(5)]],
    tags: this.fb.nonNullable.control<string[]>([], [Validators.required])
  });

  constructor() {
    this.tagsService.listTags().subscribe((tags) => this.tags.set(tags));
  }

  get hasTags(): boolean {
    return this.tags().length > 0;
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
    this.form.controls.contacts.setValue(`${current}${joiner}${content.trim()}`);
    this.expandTextarea();
  }

  onContactsInput(): void {
    this.expandTextarea();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.contactsService.importContacts(this.form.getRawValue()).subscribe(() => {
      this.snackBar.open('Contatos importados com sucesso.', 'Fechar', { duration: 4000 });
      this.form.reset({ contacts: '', tags: [] });
      this.expandTextarea();
    });
  }

  private expandTextarea(): void {
    const element = this.contactsTextarea?.nativeElement;
    if (!element) {
      return;
    }

    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 420)}px`;
  }
}
