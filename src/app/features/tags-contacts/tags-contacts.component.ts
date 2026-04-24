import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { ContactsService } from '../../core/services/contacts.service';
import { Contact } from '../../core/models/contact.model';
import { TagsService } from '../../core/services/tags.service';
import { Tag } from '../../core/models/tag.model';

@Component({
  selector: 'app-tags-contacts',
  imports: [MatCardModule, MatListModule, MatTableModule],
  templateUrl: './tags-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TagsContactsComponent {
  private readonly tagsService = inject(TagsService);
  private readonly contactsService = inject(ContactsService);

  readonly tags = signal<Tag[]>([]);
  readonly contacts = signal<Contact[]>([]);
  readonly selectedTag = signal<Tag | null>(null);

  readonly columns = ['name', 'email'];

  constructor() {
    this.tagsService.listTags().subscribe((tags) => this.tags.set(tags));
  }

  selectTag(tag: Tag): void {
    this.selectedTag.set(tag);
    this.contactsService.listByTag(tag._id ?? '').subscribe((contacts) => this.contacts.set(contacts));
  }
}
