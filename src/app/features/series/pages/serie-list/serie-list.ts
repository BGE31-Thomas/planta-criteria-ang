import { Component, inject, OnInit, signal } from '@angular/core';
import { SerieService } from '../../services/SerieService';
import { SerieUpdEdit } from '../../models/SerieUpdEdit';
import { Labels } from '../../../../utils/Labels';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  selector: 'app-serie-list',
  styleUrl: './serie-list.scss',
  templateUrl: './serie-list.html',
})
export class SerieList implements OnInit {
   
    series = signal<SerieUpdEdit[]>([]);
    private readonly serieService = inject(SerieService)
    readonly labels = new Labels();
    private readonly router = inject(Router)

     ngOnInit(): void {
      this.serieService.getAllByUser().subscribe(series=>{
        this.series.set(series);
      });
    }

    moveToCollection(serie: SerieUpdEdit): void{
      this.router.navigate(['/serie/' + serie.id + '/' + serie.slug])
    }
}
