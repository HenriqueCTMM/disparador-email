import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { DeletedContact } from '../../core/models/deleted-contact.model';
import { MaintenanceService } from '../../core/services/maintenance.service';

@Component({
  selector: 'app-deleted-contacts',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTableModule],
  templateUrl: './deleted-contacts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DeletedContactsComponent {
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly fb = inject(FormBuilder);

  readonly columns = ['email', 'reason', 'createdAt'];
  readonly removed = signal<DeletedContact[]>([]);

  readonly form = this.fb.nonNullable.group({
    email: [''],
    reason: ['']
  });

  readonly filtered = computed(() => {
    const email = this.form.controls.email.value.toLowerCase();
    const reason = this.form.controls.reason.value.toLowerCase();

    return this.removed().filter(
      (item) => item.email.toLowerCase().includes(email) && item.reason.toLowerCase().includes(reason)
    );
  });

  constructor() {
    this.maintenanceService.listDeletedContacts().subscribe((contacts) => this.removed.set(contacts));
  }
}
