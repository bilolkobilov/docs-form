import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { MatNativeDateModule } from '@angular/material/core';
import { provideRouter } from '@angular/router'; 
import { routes } from './app/app.routes';  

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    MatNativeDateModule, 
    provideRouter(routes),  
  ],
});
