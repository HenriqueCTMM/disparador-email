import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaintenanceService } from '../../core/services/maintenance.service';

@Component({
  selector: 'app-tools',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './tools.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolsComponent {
  private readonly maintenanceService = inject(MaintenanceService);
  private readonly snackBar = inject(MatSnackBar);

  runXMailerCleanup(): void {
    this.maintenanceService.removeXMailerErrors().subscribe((response) => {
      this.snackBar.open(response.message, 'Fechar', { duration: 5000 });
    });
  }
}
