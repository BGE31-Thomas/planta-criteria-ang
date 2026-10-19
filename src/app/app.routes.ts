import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

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
            import('./features/plants/components/plant-search/plant-search')
                .then(m => m.PlantSearchComponent)
    },
    {
        path: 'plants/:id/:slug',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/plants/components/plant-detail/plant-detail')
                .then(m => m.PlantDetailComponent)
    },
  
];
