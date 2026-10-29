import { Component, OnInit, inject, input, output, signal } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSelectModule } from "@angular/material/select";
import { finalize } from "rxjs";
import { Plant } from "../../../plantes/models/Plant";
import { Source } from "../../../sources/models/Source";
import { SourceService } from "../../../sources/services/SourceService";
import { CritereService } from "../../services/critereService";
import { CritereUpdEdit } from "../../models/critereUpdEdit";
import { Critere } from "../../models/critere";
import { Labels } from "../../../../utils/Labels";

@Component({
  selector: 'app-critere-create',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './critere-create.html',
  styleUrl: './critere-create.scss'
})
export class CritereCreate implements OnInit {

  private readonly fb = inject(FormBuilder);
  private readonly sourceService = inject(SourceService);
  private readonly critereService = inject(CritereService);

  readonly plant = input.required<Plant>();
  readonly criteria = input.required<Critere>();

  readonly annuler = output<void>();
  readonly critereCree = output<void>();

  readonly sources = signal<Source[]>([]);
  readonly chargementSources = signal(false);
  readonly enregistrement = signal(false);
  readonly creationSource = signal(false);
  readonly erreur = signal<string | null>(null);
  readonly criterium = signal<CritereUpdEdit>(new CritereUpdEdit())

  readonly formulaire = this.fb.group({
    organe: ['', Validators.required],
    description: ['', Validators.required],
    source_id: [null as number | null, Validators.required]
  });

  readonly formulaireSource = this.fb.group({
    titre: ['', Validators.required],
    auteur: [''],
    annee: [
      null as number | null,
      [Validators.min(1), Validators.max(9999)]
    ]
  });

  source: Source = new Source();

  critere: CritereUpdEdit = new CritereUpdEdit();

  labels = new Labels();

  title = "";

  buttonLabel = "";

  readonly formulaireCritereOuvert = signal(false);

  ouvrirFormulaireCritere(): void {
    this.formulaireCritereOuvert.set(true);
  }

  fermerFormulaireCritere(): void {
    this.formulaireCritereOuvert.set(false);

  }

  ngOnInit(): void {
    this.chargerSources();
    if (this.criteria().id > 0){
      this.title = this.labels.critereModify;
      this.formulaire.patchValue({
        organe: this.criteria().organe,
        description: this.criteria().description,
        source_id: this.criteria().source.id
      });

      this.formulaireSource.patchValue({
        titre: this.criteria().source.titre,
        auteur: this.criteria().source.auteur,
        annee: this.criteria().source.annee
      })
    }else{
      this.title = this.labels.critereCreate;
    }
    
  }

  chargerSources(): void {
    this.chargementSources.set(true);
    this.erreur.set(null);

    this.sourceService.getAll()
      .pipe(
        finalize(() => this.chargementSources.set(false))
      )
      .subscribe({
        next: sources => {
          this.sources.set(
            [...sources].sort((a, b) =>
              a.titre.localeCompare(b.titre, 'fr', {
                sensitivity: 'base'
              })
            )
          );
        },
        error: () => {
          this.erreur.set(
            'Impossible de charger les sources disponibles.'
          );
        }
      });
  }

  afficherCreationSource(): void {
    this.creationSource.set(true);
    this.erreur.set(null);
  }

  annulerCreationSource(): void {
    this.creationSource.set(false);
    this.formulaireSource.reset({
      titre: '',
      auteur: '',
      annee: null
    });
  }

  enregistrerSource(): void {
    if (this.formulaireSource.invalid) {
      this.formulaireSource.markAllAsTouched();
      return;
    }

    const valeur = this.formulaireSource.getRawValue()

    this.source.titre = valeur.titre!.trim();
    this.source.auteur = valeur.auteur?.trim() ?? '';
    this.source.annee = valeur.annee ?? 1900;

    if (!this.source.titre) {
      this.formulaireSource.controls.titre.setErrors({
        required: true
      });
      return;
    }

    this.enregistrement.set(true);
    this.erreur.set(null);

    this.sourceService.add(this.source)
      .pipe(
        finalize(() => this.enregistrement.set(false))
      )
      .subscribe({
        next: source => {
          this.sources.update(sources =>
            [...sources, source].sort((a, b) =>
              a.titre.localeCompare(b.titre, 'fr', {
                sensitivity: 'base'
              })
            )
          );

          this.formulaire.controls.source_id.setValue(source.id);

          this.annulerCreationSource();
        },
        error: () => {
          this.erreur.set(
            'Impossible de créer la source.'
          );
        }
      });
  }

  enregistrerCritere(): void {
    if (this.formulaire.invalid) {
      this.formulaire.markAllAsTouched();
      return;
    }

    const valeur = this.formulaire.getRawValue();

    this.critere.organe = valeur.organe!.trim();
    this.critere.description = valeur.description!.trim();
    this.critere.source_id = valeur.source_id!;
    this.critere.plante_id = this.plant().id;

    if (!this.critere.organe || !this.critere.description) {
      this.formulaire.markAllAsTouched();
      return;
    }

    this.enregistrement.set(true);
    this.erreur.set(null);

    if (this.criteria().id === 0) {
      // Création
      this.critereService.add(this.critere)
        .pipe(
          finalize(() => this.enregistrement.set(false))
        )
        .subscribe({
          next: () => {
            this.critereCree.emit();
            this.fermerFormulaireCritere();
            this.annuler.emit();
          },
          error: () => {
            this.erreur.set(
              'Impossible de créer le critère.'
            );
          }
        });

    } else {
      // Modification
      this.critere.id = this.criteria().id;
      this.critere.slug = this.criteria().slug;

      this.critereService.update(this.critere)
        .pipe(
          finalize(() => this.enregistrement.set(false))
        )
        .subscribe({
          next: () => {
            this.critereCree.emit();
            this.fermerFormulaireCritere();
            this.annuler.emit();
          },
          error: () => {
            this.erreur.set(
              'Impossible de modifier le critère.'
            );
          }
        });
    }
  }

  
}
