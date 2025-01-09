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
import { PrintDocumentComponent } from '../print-document/print-document.component'; // Add this import for the print modal
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
  displayedColumns: string[] = ['file', 'regNumber', 'regDate', 'outDocNumber', 'outDocDate', 'correspondent', 'subject', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  selectedRowIndex: number | null = null;

  constructor(public dialog: MatDialog, private datePipe: DatePipe) {}

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || 'Invalid Date';
  }

  // Method to select a row (either by mouse click or keyboard)
  selectRow(row: any) {
    this.selectedRowIndex = this.dataSource.data.indexOf(row);
    console.log('Row selected:', row);
  }

  // Method to handle row navigation with keyboard (up/down arrow keys)
  onRowKeyDown(event: KeyboardEvent, row: any) {
    const rowIndex = this.dataSource.data.indexOf(row);

    if (event.key === 'ArrowDown' && rowIndex < this.dataSource.data.length - 1) {
      this.selectedRowIndex = rowIndex + 1;
    } else if (event.key === 'ArrowUp' && rowIndex > 0) {
      this.selectedRowIndex = rowIndex - 1;
    }
  }

  viewDocument(element: any) {
    console.log('Viewing document:', element);
  }

  editDocument(element: any) {
    console.log('Editing document:', element);
  }

  deleteDocument(element: any) {
    console.log('Deleting document:', element);
    this.dataSource.data = this.dataSource.data.filter(doc => doc !== element);
  }

  viewFile(element: any) {
    console.log('Viewing file for document:', element);
    window.open(element.fileUrl, '_blank');
  }

  openDocumentForm() {
    const dialogRef = this.dialog.open(DocumentFormComponent, {
      width: '600px',
    });
  
    dialogRef.componentInstance.documentSaved.subscribe((newDocument) => {
      this.dataSource.data = [...this.dataSource.data, newDocument];
    });
  }
}
