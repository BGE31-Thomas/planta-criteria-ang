import {
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  catchError,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap
} from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { PlantService } from '../../services/PlantService';
import { Plant } from '../../models/Plant';
import { CritereService } from '../../../criteres/services/critereService';
import { MatTableModule } from '@angular/material/table';
import { Critere } from '../../../criteres/models/critere';
import { PlantPdfExport } from '../plant-pdf-export/plant-pdf-export';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatButtonModule,
    MatExpansionModule,
    RouterLink,
    MatTableModule,
    PlantPdfExport
  ],
  templateUrl: './plant-detail.html',
  styleUrl: './plant-detail.scss'
})
export class PlantDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly plantService = inject(PlantService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly critereService = inject(CritereService);

  readonly plant = signal<Plant | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  criteres = signal<Critere[]>([]);

  criteresParSource = computed(() => {
    const groupes = new Map<string, Critere[]>();

    for (const critere of this.criteres()) {
      const nomSource = critere.source?.titre ?? 'Source non renseignée';

      if (!groupes.has(nomSource)) {
        groupes.set(nomSource, []);
      }

      groupes.get(nomSource)!.push(critere);
    }

    return Array.from(groupes, ([source, criteres]) => ({
      source,
      criteres
    }));
  });

  displayedColumns: string[] = ['organe', 'description'];

  ngOnInit(): void {

    this.route.paramMap.pipe(

      map(params => ({
        id: Number(params.get('id')),
        slug: params.get('slug')
      })),

      distinctUntilChanged(
        (previous, current) =>
          previous.id === current.id &&
          previous.slug === current.slug
      ),

      tap(() => {
        this.loading.set(true);
        this.error.set(null);
        this.plant.set(null);
        this.criteres.set([]);
      }),

      switchMap(({ id, slug }) => {

        if (!Number.isInteger(id) || id <= 0 || !slug) {
          this.error.set('La plante demandée est invalide.');
          return of(null);
        }

        // 1. Récupération de la plante
        return this.plantService.getByIdAndSlug(id, slug).pipe(

          // 2. Récupération des critères associés
          switchMap(plant => {

            if (!plant) {
              return of(null);
            }

            return this.critereService.getAllByPlant(plant).pipe(

              map(criteres => ({
                plant,
                criteres
              })),

              catchError(() => {
                this.error.set(
                  'Impossible de charger les critères de cette plante.'
                );

                return of({
                  plant,
                  criteres: null
                });
              })
            );
          }),

          catchError(() => {
            this.error.set(
              'Impossible de charger la fiche de cette plante.'
            );

            return of(null);
          })
        );
      }),

      takeUntilDestroyed(this.destroyRef)

    ).subscribe(result => {

      if (!result) {
        if (!this.error()) {
          this.error.set('Cette plante est introuvable.');
        }

        this.plant.set(null);
        this.criteres.set([]);
        this.loading.set(false);
        return;
      }

      this.plant.set(result.plant);

      if (result.criteres !== null) {
        this.criteres.set(result.criteres);
      }

      this.loading.set(false);
    });
  }

  
}
