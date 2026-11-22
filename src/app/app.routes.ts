import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () =>
        import('./features/auth/pages/login/login')
            .then(m => m.LoginComponent)
    },
    {
        path: 'login',
        loadComponent: () =>
        import('./features/auth/pages/login/login')
            .then(m => m.LoginComponent)
    },
    {
        path: 'plants/search',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/plantes/pages/plant-search/plant-search')
                .then(m => m.PlantSearchComponent)
    },
    {
        path: 'plants/:id/:slug',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/plantes/pages/plant-detail/plant-detail')
                .then(m => m.PlantDetailComponent)
    },
    {
        path: 'criteres/:id/:slug',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/criteres/pages/critere-create/critere-create')
                .then(m => m.CritereCreate)
    },
    {
        path: 'serie/:id/:slug',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/series/pages/serie-detail/serie-detail')
            .then(m => m.SerieDetailPage)
    },
     {
        path: 'series',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/series/pages/serie-list/serie-list')
            .then(m => m.SerieList)
    }
  
];
