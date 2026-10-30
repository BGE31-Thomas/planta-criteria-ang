import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { environment } from '../../../../environments/environment';
import { ImageService } from '../../../features/images/services/imageService';
import { IImage } from '../../../features/images/models/IImage';

export interface CritereGalerieData {
  critereId: number;
  organe: string;
}

@Component({
  selector: 'app-critere-galerie',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './critere-galerie.html',
  styleUrl: './critere-galerie.scss'
})
export class CritereGalerieComponent implements OnInit {

  private readonly imageService = inject(ImageService);

  private readonly dialogRef =
    inject(MatDialogRef<CritereGalerieComponent>);

  readonly data = inject<CritereGalerieData>(MAT_DIALOG_DATA);

  readonly images = signal<IImage[]>([]);

  readonly imageSelectionnee = signal<IImage | null>(null);

  readonly chargement = signal(true);

  readonly erreur = signal<string | null>(null);

  readonly imageBaseUrl = environment.java_server;

  ngOnInit(): void {
    this.chargerImages();
  }

  chargerImages(): void {

    this.chargement.set(true);
    this.erreur.set(null);

    this.imageService
      .getAllByCritere(this.data.critereId)
      .subscribe({
        next: images => {

          this.images.set(images);

          // Sélectionner automatiquement la première image
          if (images.length > 0) {
            this.imageSelectionnee.set(images[0]);
          }

          this.chargement.set(false);
        },

        error: () => {
          this.erreur.set(
            'Impossible de charger les images du critère.'
          );

          this.chargement.set(false);
        }
      });
  }

  getImageUrl(image: IImage): string {
    return `${this.imageBaseUrl}/uploads/images/${image.chemin}`;
  }

  selectionnerImage(image: IImage): void {
    this.imageSelectionnee.set(image);
  }

  fermer(): void {
    this.dialogRef.close();
  }
}
