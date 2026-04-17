import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-unsubscribe',
  imports: [MatCardModule],
  template: `
    <mat-card class="mx-auto max-w-xl p-6">
      <h1 class="mb-2 text-xl font-semibold">Descadastro</h1>
      <p class="text-slate-700">Solicitação recebida. Se os parâmetros estiverem válidos, seu e-mail será removido.</p>
    </mat-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UnsubscribeComponent {}
