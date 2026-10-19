import {
  Component,
  DestroyRef,
  OnInit,
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
import { PlantService } from '../../../plantes/services/PlantService';
import { Plant } from '../../../plantes/models/Plant';

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
    RouterLink
  ],
  templateUrl: './plant-detail.html',
  styleUrl: './plant-detail.scss'
})
export class PlantDetailComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly plantService = inject(PlantService);
  private readonly destroyRef = inject(DestroyRef);

  readonly plant = signal<Plant | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

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
      }),

      switchMap(({ id, slug }) => {

        if (!Number.isInteger(id) || id <= 0 || !slug) {
          this.error.set('La plante demandée est invalide.');
          return of(null);
        }

        return this.plantService.getByIdAndSlug(id, slug).pipe(
          catchError(() => {
            this.error.set(
              'Impossible de charger la fiche de cette plante.'
            );

            return of(null);
          })
        );
      }),

      takeUntilDestroyed(this.destroyRef)

    ).subscribe(plant => {

      if (!plant && !this.error()) {
        this.error.set('Cette plante est introuvable.');
      }

      this.plant.set(plant);
      this.loading.set(false);
    });
  }
}
