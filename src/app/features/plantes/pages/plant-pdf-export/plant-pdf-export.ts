import { Component, computed, input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { Critere } from '../../../criteres/models/critere';
import { Plant } from '../../models/Plant';

@Component({
  selector: 'app-plant-pdf-export',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './plant-pdf-export.html',
  styleUrl: './plant-pdf-export.scss'
})
export class PlantPdfExport {

  // Données reçues du composant parent
  plant = input.required<Plant>();
  criteres = input.required<Critere[]>();

  // Regroupement des critères par source
  criteresParSource = computed(() => {

    const groupes = new Map<string, Critere[]>();

    for (const critere of this.criteres()) {

      const source = critere.source?.titre ?? 'Source non renseignée';

      if (!groupes.has(source)) {
        groupes.set(source, []);
      }

      groupes.get(source)!.push(critere);
    }

    return Array.from(groupes, ([source, criteres]) => ({
      source,
      criteres
    }));
  });

  exportPdf(): void {

    const plant = this.plant();
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
  
}
