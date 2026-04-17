import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactsService } from '../../core/services/contacts.service';
import { normalizeEmail } from '../../shared/utils/email.util';

@Component({
  selector: 'app-maintenance',
  imports: [ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './maintenance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaintenanceComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactsService = inject(ContactsService);
  private readonly snackBar = inject(MatSnackBar);

  readonly checkResult = signal<boolean | null>(null);

  readonly checkForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  readonly updateForm = this.fb.nonNullable.group({
    contact: ['', [Validators.required, Validators.email]],
    newEmail: ['', [Validators.required, Validators.email]]
  });

  readonly removeForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  checkExists(): void {
    if (this.checkForm.invalid) {
      this.checkForm.markAllAsTouched();
      return;
    }

    const email = normalizeEmail(this.checkForm.controls.email.value);
    this.contactsService.checkExists(email).subscribe((response) => this.checkResult.set(response.contactExists));
  }

  updateEmail(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.contactsService
      .updateEmail({
        contact: normalizeEmail(this.updateForm.controls.contact.value),
        newEmail: normalizeEmail(this.updateForm.controls.newEmail.value)
      })
      .subscribe((contact) => {
        const message = contact ? 'E-mail atualizado com sucesso.' : 'Contato não encontrado.';
        this.snackBar.open(message, 'Fechar', { duration: 4000 });
      });
  }

  removeManually(): void {
    if (this.removeForm.invalid) {
      this.removeForm.markAllAsTouched();
      return;
    }

    const email = normalizeEmail(this.removeForm.controls.email.value);
    this.contactsService.removeManually(email).subscribe((response) => {
      const parsed = typeof response === 'string' ? response : JSON.stringify(response);
      this.snackBar.open(parsed || 'Contato removido.', 'Fechar', { duration: 5000 });
    });
  }
}
