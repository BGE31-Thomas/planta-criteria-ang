import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { inject, signal, OnInit } from '@angular/core';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommuneService, Commune } from '../../../features/communes/services/communeService';
import { Labels } from '../../../utils/Labels';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SerieUpdEdit } from '../../../features/series/models/SerieUpdEdit';
import { SerieService } from '../../../features/series/services/SerieService';
import { ObservationService } from '../../../features/observations/services/observationService';
import { ObservationUpdEdit } from '../../../features/observations/models/ObservationUpdEdit';



export interface CollectionCreateData {
  plantId: number;
  
}

@Component({
  imports: [
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
 
  ],
  selector: 'app-collection-create',
  styleUrl: './collection-create.scss',
  templateUrl: './collection-create.html',
})
export class CollectionCreate implements OnInit {
  private communeService = inject(CommuneService);

  private serieService = inject(SerieService);

  private observationService = inject(ObservationService);

  readonly data = inject<CollectionCreateData>(MAT_DIALOG_DATA);

  private readonly dialogRef = inject(MatDialogRef<CollectionCreate>);

  // Date maximale autorisée
  dateMax = new Date();

  // Liste des communes proposées
  communes = signal<Commune[]>([]);

  private readonly fb = inject(FormBuilder);

  collection = new SerieUpdEdit();

  readonly formulaire = this.fb.group({
    libelle: ['', Validators.required],
    date: [null as Date | null, Validators.required],
    commune: [null as Commune | string | null, Validators.required]
  });

  labels = new Labels();

  // Affichage du nom de la commune dans le champ
  afficherCommune = (commune: Commune | null): string => {
    return commune ? commune.nom : '';
  };
 
  ngOnInit(): void {

    this.formulaire.controls.commune.valueChanges.pipe(

      debounceTime(300),

      filter((value): value is string =>
        typeof value === 'string' && value.length >= 2
      ),

      distinctUntilChanged(),

      switchMap(nom =>
        this.communeService.rechercher(nom).pipe(
          catchError(() => of([]))
        )
      )

    ).subscribe(communes => {
      this.communes.set(communes);
    });

  }

  enregistrerCollection(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    const valeur = this.formulaire.getRawValue();

    this.collection.intitule = valeur.libelle!.trim();
    this.collection.date = valeur.date;

    if (typeof valeur.commune === 'object' && valeur.commune !== null) {
      this.collection.lieu = valeur.commune?.nom;
    }

    console.log('Collection à enregistrer :', this.collection);
    if (!this.collection.intitule || !this.collection.date || !this.collection.lieu) {
      this.formulaire.markAllAsTouched();
      return;
    }

    if (this.collection.id === 0) {
      // Création
      this.serieService.add(this.collection)
        .subscribe((resp) => {
            console.log('Collection créée avec succès :', resp);
            let observation = new ObservationUpdEdit();
            observation.serieId = resp.id;
            observation.planteId = this.data.plantId;
            console.log('Observation à créer :', observation);
            this.observationService.add(observation).subscribe((obsResp) => {
                console.log('Observation créée avec succès :', obsResp);
                this.fermerDialog();
            });
          }
        );
    }
  }

  fermerDialog(): void {
    this.dialogRef.close();
  }
}
