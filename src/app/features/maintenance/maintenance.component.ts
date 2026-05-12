import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactsService } from '../../core/services/contacts.service';
import { normalizeEmail } from '../../shared/utils/email.util';

const parseEmailList = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .split(/[\n,;]+/)
        .map((item) => normalizeEmail(item))
        .filter((item) => item.includes('@')),
    ),
  );

const emailListValidator: ValidatorFn = (control) =>
  parseEmailList(String(control.value ?? '')).length > 0 ? null : { emailList: true };

@Component({
  selector: 'app-maintenance',
  imports: [
    ReactiveFormsModule,
    CdkTextareaAutosize,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './maintenance.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MaintenanceComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactsService = inject(ContactsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly contactsTextarea =
    viewChild<ElementRef<HTMLTextAreaElement>>('contactsTextarea');

  readonly checkResult = signal<boolean | null>(null);

  readonly checkForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  readonly updateForm = this.fb.nonNullable.group({
    contact: ['', [Validators.required, Validators.email]],
    newEmail: ['', [Validators.required, Validators.email]],
  });

  readonly removeForm = this.fb.nonNullable.group({
    contacts: ['', [Validators.required, emailListValidator]],
  });

  checkExists(): void {
    if (this.checkForm.invalid) {
      this.checkForm.markAllAsTouched();
      return;
    }

    const email = normalizeEmail(this.checkForm.controls.email.value);
    this.contactsService
      .checkExists(email)
      .subscribe((response) => this.checkResult.set(response.contactExists));
  }

  updateEmail(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.contactsService
      .updateEmail({
        contact: normalizeEmail(this.updateForm.controls.contact.value),
        newEmail: normalizeEmail(this.updateForm.controls.newEmail.value),
      })
      .subscribe((contact) => {
        const message = contact ? 'E-mail atualizado com sucesso.' : 'Contato não encontrado.';
        this.snackBar.open(message, 'Fechar', { duration: 4000 });
      });
  }

  async loadRemovalFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.item(0);
    if (!file) {
      return;
    }

    const content = await file.text();
    const current = this.removeForm.controls.contacts.value;
    const joiner = current ? '\n' : '';
    this.removeForm.controls.contacts.setValue(`${current}${joiner}${content.trim()}`);
    this.expandTextarea();
  }

  onContactsInput(): void {
    this.expandTextarea();
  }

  removeManually(): void {
    if (this.removeForm.invalid) {
      this.removeForm.markAllAsTouched();
      return;
    }

    const contacts = parseEmailList(this.removeForm.controls.contacts.value);
    this.contactsService.removeManually({ contacts }).subscribe((response) => {
      const notFoundMessage =
        response.notFound.length > 0 ? ` ${response.notFound.length} não encontrado(s).` : '';
      this.snackBar.open(`${response.message}${notFoundMessage}`, 'Fechar', { duration: 5000 });
      this.removeForm.reset({ contacts: '' });
      this.expandTextarea();
    });
  }

  private expandTextarea(): void {
    const element = this.contactsTextarea()?.nativeElement;
    if (!element) {
      return;
    }

    element.style.height = 'auto';
    element.style.height = `${Math.min(element.scrollHeight, 420)}px`;
  }
}
