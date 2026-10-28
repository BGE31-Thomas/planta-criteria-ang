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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CritereCreate } from '../../../criteres/pages/critere-create/critere-create';
import { CritereUpdEdit } from '../../../criteres/models/critereUpdEdit';

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
    CritereCreate
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
  readonly criteria = signal<Critere>(new Critere);

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

  synonymesTries = computed(() =>
    [...(this.plant()?.synonymes ?? [])].sort((a, b) =>
      a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' })
    )
  );

  displayedColumns: string[] = ['organe', 'description', 'action'];

  readonly formulaireCritereOuvert = signal(false);
  readonly formulaireCritereEditOuvert = signal(false);

  ouvrirFormulaireCritere(critere: Critere): void {
    this.criteria.set(critere);
    this.formulaireCritereOuvert.set(true);

  }

  fermerFormulaireCritere(): void {
    this.formulaireCritereOuvert.set(false);
  }

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

  exportPdf(): void {

    const plant = this.plant();
    if (!plant) {
      return;
    }

    const groupes = this.criteresParSource();

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const marginLeft = 14;
    const marginRight = 14;
    const marginTop = 20;
    const marginBottom = 20;

    const contentWidth = pageWidth - marginLeft - marginRight;

    // Position verticale courante
    let currentY = marginTop;

    // --------------------------------------------------
    // En-tête de la fiche
    // --------------------------------------------------

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(18);

    const titre = plant.nom || 'Fiche botanique';

    const titreLines = doc.splitTextToSize(
      titre,
      contentWidth
    );

    doc.text(titreLines, pageWidth / 2, currentY, {
      align: 'center'
    });

    currentY += titreLines.length * 8 + 4;

    // Famille botanique
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    doc.text(
      `Famille : ${plant.famille || 'Non renseignée'}`,
      marginLeft,
      currentY
    );

    currentY += 10;

    // Séparateur
    doc.setDrawColor(100, 130, 100);

    doc.line(
      marginLeft,
      currentY,
      pageWidth - marginRight,
      currentY
    );

    currentY += 10;


    // --------------------------------------------------
    // Titre de la section
    // --------------------------------------------------

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);

    doc.text(
      'Synonymes',
      marginLeft,
      currentY
    );

    currentY += 9;


  // --------------------------------------------------
  // Affichage des synonymes
  // --------------------------------------------------

  if (plant.synonymes?.length) {

    // Tableau des synonymes
    autoTable(doc, {

      startY: currentY,

      margin: {
        left: marginLeft,
        right: marginRight,
        top: marginTop,
        bottom: marginBottom
      },

      body: [...plant.synonymes]
        .sort((a, b) =>
          a.nom.localeCompare(b.nom, 'fr', {
            sensitivity: 'base'
          })
        )
        .map(synonyme => [
          synonyme.nom
        ]),

      theme: 'grid',

      styles: {
        font: 'helvetica',
        fontSize: 9,
        cellPadding: 3,
        overflow: 'linebreak',
        valign: 'top',
        lineColor: [210, 210, 210],
        lineWidth: 0.2
      },

      headStyles: {
        fillColor: [65, 100, 65],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },

      columnStyles: {
        0: {
          cellWidth: 'auto'
        }
      },

      showHead: 'everyPage',

      // Éviter de couper une ligne entre deux pages
      rowPageBreak: 'avoid',

      pageBreak: 'auto'
    });

    // Récupérer la position finale du tableau
    const lastTable = (
      doc as jsPDF & {
        lastAutoTable?: { finalY: number };
      }
    ).lastAutoTable;

    currentY = (lastTable?.finalY ?? currentY) + 10;
  }

    // --------------------------------------------------
    // Titre de la section
    // --------------------------------------------------

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);

    doc.text(
      'Critères de détermination',
      marginLeft,
      currentY
    );

    currentY += 9;

    // --------------------------------------------------
    // Critères regroupés par source
    // --------------------------------------------------

    for (const groupe of groupes) {

      const sourceLines = doc.splitTextToSize(
        groupe.source,
        contentWidth
      );

      const sourceTitleHeight = sourceLines.length * 6;

      // Vérifier qu'il reste suffisamment de place
      // pour le titre et le début du tableau.
      if (
        currentY + sourceTitleHeight + 20 >
        pageHeight - marginBottom
      ) {
        doc.addPage();
        currentY = marginTop;
      }

      // Titre de la source
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);

      doc.text(
        sourceLines,
        marginLeft,
        currentY
      );

      currentY += sourceTitleHeight + 3;

      // Tableau des critères de cette source
      autoTable(doc, {

        startY: currentY,

        margin: {
          left: marginLeft,
          right: marginRight,
          top: marginTop,
          bottom: marginBottom
        },

        head: [
          ['Organe', 'Description']
        ],

        body: groupe.criteres.map((critere: Critere) => [
          critere.organe ?? '',
          critere.description ?? ''
        ]),

        theme: 'grid',

        styles: {
          font: 'helvetica',
          fontSize: 9,
          cellPadding: 3,
          overflow: 'linebreak',
          valign: 'top',
          lineColor: [210, 210, 210],
          lineWidth: 0.2
        },

        headStyles: {
          fillColor: [65, 100, 65],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },

        columnStyles: {
          0: {
            cellWidth: 38
          },
          1: {
            cellWidth: 'auto'
          }
        },

        showHead: 'everyPage',

        // Éviter de couper une ligne entre deux pages
        // lorsque sa hauteur le permet.
        rowPageBreak: 'avoid',

        pageBreak: 'auto'
      });

      // Récupérer la position finale du tableau
      const lastTable = (
        doc as jsPDF & {
          lastAutoTable?: { finalY: number };
        }
      ).lastAutoTable;

      currentY = (lastTable?.finalY ?? currentY) + 10;
    }

    // --------------------------------------------------
    // Pied de page et pagination
    // --------------------------------------------------

    const pageCount = doc.getNumberOfPages();

    for (let page = 1; page <= pageCount; page++) {

      doc.setPage(page);

      doc.setDrawColor(200, 200, 200);

      doc.line(
        marginLeft,
        pageHeight - 15,
        pageWidth - marginRight,
        pageHeight - 15
      );

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);

      doc.text(
        `Fiche botanique - ${plant.nom}`,
        marginLeft,
        pageHeight - 9
      );

      doc.text(
        `Page ${page} / ${pageCount}`,
        pageWidth - marginRight,
        pageHeight - 9,
        { align: 'right' }
      );
    }

    // --------------------------------------------------
    // Téléchargement du PDF
    // --------------------------------------------------

    const filename = plant.nom
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9_-]+/g, '_')
      .replace(/^_+|_+$/g, '');

    doc.save(`fiche_${filename || plant.id}.pdf`);
  }

  rechargerCriteres(): void {
    const plant = this.plant();

    if (!plant) {
      return;
    }

    this.critereService.getAllByPlant(plant).subscribe({
      next: criteres => {
        this.criteres.set(criteres);
        this.formulaireCritereOuvert.set(false);
      },
      error: () => {
        this.error.set(
          'Le critère a été créé, mais la liste des critères n’a pas pu être actualisée.'
        );

        this.formulaireCritereOuvert.set(false);
      }
    });
  }
  
}
