import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DocumentFormComponent } from '../document-form/document-form.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common'; 
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatNativeDateModule } from '@angular/material/core'; 

@Component({
  selector: 'app-document-registry',
  standalone: true,
  templateUrl: './document-registry.component.html',
  styleUrls: ['./document-registry.component.css'],
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSortModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [DatePipe],  
})
export class DocumentRegistryComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort | undefined;
  displayedColumns: string[] = ['file', 'regNumber', 'regDate', 'correspondent', 'subject', 'actions'];
  
  dataSource = new MatTableDataSource<any>([]);

  constructor(public dialog: MatDialog, private datePipe: DatePipe) {}

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  // Updated method to format date using DatePipe
  formatDate(date: string): string {
    // Using DatePipe to format the date in a consistent manner
    return this.datePipe.transform(date, 'dd.MM.yyyy') || 'Invalid Date';  // Returns 'Invalid Date' if date is invalid
  }

  openDocumentForm() {
    const dialogRef = this.dialog.open(DocumentFormComponent, {
      width: '600px',
    });
  
    // Subscribe to the documentSaved event
    dialogRef.componentInstance.documentSaved.subscribe((newDocument) => {
      this.dataSource.data = [...this.dataSource.data, newDocument];  // Add the new document to the data source
    });
  }
  

  viewDocument(element: any) {
    console.log('Viewing document:', element);
  }

  editDocument(element: any) {
    const dialogRef = this.dialog.open(DocumentFormComponent, {
      width: '600px',
      data: element,  // Pass the selected document data to the form
    });
  
    // Subscribe to the documentSaved event to update the table with the edited document
    dialogRef.componentInstance.documentSaved.subscribe((updatedDocument) => {
      const index = this.dataSource.data.findIndex(doc => doc.id === updatedDocument.id);
      if (index !== -1) {
        // Update the existing document with the edited values
        this.dataSource.data[index] = updatedDocument;
        this.dataSource.data = [...this.dataSource.data];  // Trigger change detection
      }
    });
  }
  

  deleteDocument(element: any) {
    console.log('Deleting document:', element);
    this.dataSource.data = this.dataSource.data.filter(doc => doc !== element);
  }

  viewFile(element: any) {
    console.log('Viewing file for document:', element);
    window.open(element.fileUrl, '_blank');
  }

}