import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { finalize, forkJoin } from 'rxjs';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { Contact } from '../../core/models/contact.model';
import { Tag } from '../../core/models/tag.model';
import { ContactsService } from '../../core/services/contacts.service';
import { TagsService } from '../../core/services/tags.service';

@Component({
  selector: 'app-tags-contacts',
  imports: [
    MatCardModule,
    MatListModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './tags-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagsContactsComponent {
  private readonly tagsService = inject(TagsService);
  private readonly contactsService = inject(ContactsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly tags = signal<Tag[]>([]);
  readonly contacts = signal<Contact[]>([]);
  readonly selectedTag = signal<Tag | null>(null);
  readonly editingTagId = signal<string | null>(null);
  readonly saving = signal(false);

  readonly createTagsControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly editTagControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly columns = ['name', 'email'];

  constructor() {
    this.loadTags();
  }

  loadTags(): void {
    this.tagsService.listTags().subscribe((tags) => {
      this.tags.set(tags);

      const selectedId = this.selectedTag()?._id;
      if (!selectedId) {
        return;
      }

      const refreshedSelected = tags.find((tag) => tag._id === selectedId) ?? null;
      this.selectedTag.set(refreshedSelected);
    });
  }

  selectTag(tag: Tag): void {
    this.selectedTag.set(tag);
    this.contactsService
      .listByTag(tag._id ?? '')
      .subscribe((contacts) => this.contacts.set(contacts));
  }

  createTags(): void {
    if (this.createTagsControl.invalid || this.saving()) {
      this.createTagsControl.markAsTouched();
      return;
    }

    const titles = this.parseTitles(this.createTagsControl.value);
    if (titles.length === 0) {
      this.createTagsControl.setErrors({ required: true });
      return;
    }

    this.saving.set(true);
    forkJoin(titles.map((title) => this.tagsService.createTag(title)))
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe(() => {
        this.snackBar.open(
          titles.length === 1
            ? 'Tag criada com sucesso.'
            : `${titles.length} tags criadas com sucesso.`,
          'Fechar',
          { duration: 4000 },
        );
        this.createTagsControl.reset('');
        this.loadTags();
      });
  }

  startEdit(tag: Tag): void {
    if (!tag._id) {
      return;
    }

    this.editingTagId.set(tag._id);
    this.editTagControl.setValue(tag.title);
  }

  cancelEdit(): void {
    this.editingTagId.set(null);
    this.editTagControl.reset('');
  }

  saveEdit(tag: Tag): void {
    if (!tag._id || this.editTagControl.invalid || this.saving()) {
      this.editTagControl.markAsTouched();
      return;
    }

    const title = this.editTagControl.value.trim();
    if (!title) {
      this.editTagControl.setErrors({ required: true });
      return;
    }

    this.saving.set(true);
    this.tagsService
      .updateTag(tag._id, title)
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe(() => {
        this.snackBar.open('Tag atualizada.', 'Fechar', { duration: 4000 });
        this.cancelEdit();
        this.loadTags();
      });
  }

  deleteTag(tag: Tag): void {
    if (!tag._id || this.saving()) {
      return;
    }

    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          title: 'Excluir tag',
          message: `Deseja excluir a tag "${tag.title}"?`,
          confirmLabel: 'Excluir',
        },
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }

        this.saving.set(true);
        this.tagsService
          .deleteTag(tag._id!)
          .pipe(finalize(() => this.saving.set(false)))
          .subscribe(() => {
            this.snackBar.open('Tag removida.', 'Fechar', { duration: 4000 });
            if (this.selectedTag()?._id === tag._id) {
              this.selectedTag.set(null);
              this.contacts.set([]);
            }
            this.loadTags();
          });
      });
  }

  private parseTitles(rawTitles: string): string[] {
    const uniqueTitles = new Set(
      rawTitles
        .split(/[,;\n]/)
        .map((title) => title.trim())
        .filter((title) => title.length > 0),
    );

    return Array.from(uniqueTitles);
  }
}
