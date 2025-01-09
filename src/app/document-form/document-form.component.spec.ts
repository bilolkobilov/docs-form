import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentFormComponent } from './document-form.component';

describe('DocumentFormComponent', () => {
  let component: DocumentFormComponent;
  let fixture: ComponentFixture<DocumentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
