import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentRegistryComponent } from './document-registry.component';

describe('DocumentRegistryComponent', () => {
  let component: DocumentRegistryComponent;
  let fixture: ComponentFixture<DocumentRegistryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentRegistryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumentRegistryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
