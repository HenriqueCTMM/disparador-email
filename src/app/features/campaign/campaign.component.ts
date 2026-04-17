import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CampaignService } from '../../core/services/campaign.service';
import { Tag } from '../../core/models/tag.model';
import { Template } from '../../core/models/template.model';
import { TagsService } from '../../core/services/tags.service';
import { TemplatesService } from '../../core/services/templates.service';

@Component({
  selector: 'app-campaign',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './campaign.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CampaignComponent {
  private readonly fb = inject(FormBuilder);
  private readonly templatesService = inject(TemplatesService);
  private readonly tagsService = inject(TagsService);
  private readonly campaignService = inject(CampaignService);
  private readonly snackBar = inject(MatSnackBar);

  readonly templates = signal<Template[]>([]);
  readonly tags = signal<Tag[]>([]);

  readonly form = this.fb.nonNullable.group({
    templateId: ['', [Validators.required]],
    tags: this.fb.nonNullable.control<string[]>([], [Validators.required])
  });

  constructor() {
    this.templatesService.listTemplates().subscribe((templates) => this.templates.set(templates));
    this.tagsService.listTags().subscribe((tags) => this.tags.set(tags));
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.campaignService.enqueueMessage(this.form.getRawValue()).subscribe((response) => {
      this.snackBar.open(response.message || 'Disparo enfileirado.', 'Fechar', { duration: 4500 });
    });
  }
}
