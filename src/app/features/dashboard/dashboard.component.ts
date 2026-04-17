import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MaintenanceService } from '../../core/services/maintenance.service';
import { TagsService } from '../../core/services/tags.service';
import { TemplatesService } from '../../core/services/templates.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatCardModule, MatButtonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  private readonly templatesService = inject(TemplatesService);
  private readonly tagsService = inject(TagsService);
  private readonly maintenanceService = inject(MaintenanceService);

  readonly templateCount = signal(0);
  readonly tagCount = signal(0);
  readonly deletedCount = signal(0);

  constructor() {
    forkJoin({
      templates: this.templatesService.listTemplates(),
      tags: this.tagsService.listTags(),
      removed: this.maintenanceService.listDeletedContacts()
    }).subscribe(({ templates, tags, removed }) => {
      this.templateCount.set(templates.length);
      this.tagCount.set(tags.length);
      this.deletedCount.set(removed.length);
    });
  }
}
