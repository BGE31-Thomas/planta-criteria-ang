import { Component, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  of,
  tap,
  map
} from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlantSearch } from '../../models/PlantSearch';
import { PlantService } from '../../services/PlantService';



@Component({
  selector: 'app-plant-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './plant-search.html',
  styleUrl: './plant-search.scss'
})
export class PlantSearchComponent {

  private readonly plantService = inject(PlantService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchControl = new FormControl<string | PlantSearch>('');

  readonly suggestions = signal<PlantSearch[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.searchControl.valueChanges.pipe(

      // Une nouvelle saisie annule la recherche précédente.
      debounceTime(300),

      // Une sélection de plante peut aussi modifier le champ.
      map(value => typeof value === 'string' ? value.trim() : ''),

      distinctUntilChanged(),

      tap(search => {
        this.suggestions.set([]);
        this.error.set(null);
      }),

      switchMap(search => {
        if (search.length < 2) {
          this.loading.set(false);
          return of([]);
        }

        this.loading.set(true);

        return this.plantService.find(search).pipe(
          catchError(() => {
            this.error.set('Impossible de charger les plantes.');
            return of([]);
          }),
          tap(() => this.loading.set(false))
        );
      }),

      takeUntilDestroyed(this.destroyRef)

    ).subscribe(plants => {
      this.suggestions.set(plants);
      this.loading.set(false);
    });
  }

  /**
   * Texte affiché dans le champ Material.
   */
  displayPlant = (plant: PlantSearch | string | null): string => {
    if (typeof plant === 'string') {
      return plant;
    }

    return plant?.nomCompletHtml ?? '';
  };

  /**
   * Navigation vers la fiche de la plante sélectionnée.
   */
  selectPlant(event: MatAutocompleteSelectedEvent): void {
    const plant = event.option.value as PlantSearch;

    if (!plant?.id || !plant.slug) {
      return;
    }
    console.log('Selected plant:', plant);
    this.suggestions.set([]);

    this.router.navigate([
      '/plants',
      plant.id,
      plant.slug
    ]);
  }
}