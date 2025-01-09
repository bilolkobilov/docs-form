import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { MatNativeDateModule } from '@angular/material/core';
import { provideRouter } from '@angular/router';  // Import provideRouter
import { routes } from './app/app.routes';  // Import your routes

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    MatNativeDateModule, // Required for Material Datepicker
    provideRouter(routes),  // Use provideRouter to configure routes
  ],
});
