import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { SerieService } from '../../../features/series/services/SerieService';
import { SerieUpdEdit } from '../../../features/series/models/SerieUpdEdit';
import { ObservationService } from '../../../features/observations/services/observationService';
import { ObservationUpdEdit } from '../../../features/observations/models/ObservationUpdEdit';
import { Labels } from '../../../utils/Labels';

export interface ExistingCollectionDialogData {
    planteId: number;
}

@Component({
    selector: 'app-existing-collection-dialog',
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatListModule,
        MatCardModule
    ],
    templateUrl: './existing-collection.html',
    styleUrl: './existing-collection.scss'
})
export class ExistingCollectionDialog implements OnInit {

    private labels = new Labels();

    private serieService = inject(SerieService);

    private observationService = inject(ObservationService);

    private dialogRef = inject(
        MatDialogRef<ExistingCollectionDialog>
    );

    data = inject<ExistingCollectionDialogData>(MAT_DIALOG_DATA);

    series = signal<SerieUpdEdit[]>([]);
    chargement = signal(true);
    ajoutEnCours = signal<number | null>(null);
    erreur = signal<string | null>(null);

    ngOnInit(): void {
        this.loadSeries();
    }

    loadSeries(): void {

        this.serieService.getAllByUser().subscribe({

            next: series => {
                this.series.set(series);
                this.chargement.set(false);
            },

            error: () => {
                this.erreur.set(
                    'Impossible de récupérer vos collections.'
                );
                this.chargement.set(false);
            }
        });
    }

    ajouter(serie: SerieUpdEdit): void {

        this.erreur.set(null);
        this.ajoutEnCours.set(serie.id);

        let observation = new ObservationUpdEdit();
        observation.serieId = serie.id;
        observation.planteId = this.data.planteId;

        this.observationService.add(
            observation
        ).subscribe({

            next: observation => {
                this.ajoutEnCours.set(null);

                this.dialogRef.close({
                    success: true,
                    serieId: serie.id,
                    observation
                });
            },

            error: err => {
                this.ajoutEnCours.set(null);

                this.erreur.set(
                    err.error?.message ??
                    'La plante est déjà présente dans cette collection.'
                );
            }
        });
    }

    fermer(): void {
        this.dialogRef.close();
    }
}