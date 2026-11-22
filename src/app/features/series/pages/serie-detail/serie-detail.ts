import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { finalize } from 'rxjs';
import { ObservationCritereService } from '../../../observations/services/observationCritereService';
import { Statut } from '../../../statuts/models/Statut';
import { StatutService } from '../../../statuts/services/StatutService';
import { SerieDetail } from '../../models/SerieDetail';
import { SerieService } from '../../services/SerieService';
import { ObservationCritere } from '../../../observations/models/ObservationCritere';

@Component({
  selector: 'app-serie-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DatePipe
  ],
  templateUrl: './serie-detail.html',
  styleUrl: './serie-detail.scss'
})
export class SerieDetailPage implements OnInit {

  private route = inject(ActivatedRoute);
  private serieService = inject(SerieService);
  private observationCritereService = inject(ObservationCritereService);
  private statutService = inject(StatutService);

  serie = signal<SerieDetail | null>(null);
  statuts = signal<Statut[]>([]);

  chargement = signal(true);
  erreur = signal<string | null>(null);

  // Identifiants des critères en cours d'enregistrement
  enregistrement = signal<number[]>([]);

  ngOnInit(): void {

    const id = Number(this.route.snapshot.paramMap.get('id'));
    const slug = this.route.snapshot.paramMap.get('slug') || '';

    if (!id || !Number.isInteger(id)) {
      this.erreur.set('Identifiant de série invalide.');
      this.chargement.set(false);
      return;
    }

    this.chargerSerie(id, slug);
    this.chargerStatuts();
  }

  /**
   * Récupération du détail de la série
   */
  chargerSerie(id: number, slug: string): void {

    this.serieService.getDetail(id, slug).subscribe({

      next: serie => {
        console.log(serie);
        this.serie.set(serie);
        this.chargement.set(false);
      },

      error: () => {
        this.erreur.set(
          'Impossible de charger le détail de cette série.'
        );
        this.chargement.set(false);
      }

    });
  }

  /**
   * Récupération des statuts disponibles
   */
  chargerStatuts(): void {

    this.statutService.getAll().subscribe({

      next: statuts => {
        this.statuts.set(statuts);
      },

      error: () => {
        this.erreur.set(
          'Impossible de récupérer les statuts.'
        );
      }

    });
  }

  /**
   * Modification du statut d'un critère observé
   */
  changerStatut(
    item: ObservationCritere,
    statutId: number
  ): void {

    // Évite les modifications simultanées du même critère
    if (this.enregistrement().includes(item.id)) {
      return;
    }

    const nouveauStatut = this.statuts().find(
      statut => statut.id === statutId
    );

    if (!nouveauStatut || item.statut.id === statutId) {
      return;
    }

    this.enregistrement.update(ids => [
      ...ids,
      item.id
    ]);

    this.erreur.set(null);

    this.observationCritereService
      .updateStatut(item.id, item.slug, statutId)
      .pipe(
        finalize(() => {
          this.enregistrement.update(ids =>
            ids.filter(id => id !== item.id)
          );
        })
      )
      .subscribe({

        next: resultat => {

          // Mise à jour du statut uniquement après confirmation serveur
          /* this.mettreAJourStatut(
            item.id,
            resultat.statut
          ); */

        },

        error: () => {

          this.erreur.set(
            'La modification du statut a échoué. Veuillez réessayer.'
          );

        }

      });
  }

  /**
   * Mise à jour immuable du statut dans le signal
   */
  /* private mettreAJourStatut(
    observationCritereId: number,
    statut: Statut
  ): void {

    this.serie.update(serie => {
    if (!serie) {
      return null;
    }

    return {
      ...serie,
      observations: serie.observations.map(observation => ({
        ...observation,
        observationsCritere: observation.observationsCritere.map(item =>
          item.id === observationCritereId
            ? { ...item, statut }
            : item
        )
      }))
    };
  });

}  */
}