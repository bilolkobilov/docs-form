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
import { PrintDocumentComponent } from '../print-document/print-document.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

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
    MatPaginatorModule,
    CommonModule
  ],
  providers: [DatePipe],
})
export class DocumentRegistryComponent implements AfterViewInit {
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  displayedColumns: string[] = ['file', 'regNumber', 'regDate', 'outDocNumber', 'outDocDate', 'correspondent', 'subject', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  selectedRowIndex: number = 0;

  constructor(public dialog: MatDialog, private datePipe: DatePipe) { }

  // Инициализация сортировки таблицы
  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    this.focusSelectedRow();
  }

  ngOnInit() {
    if (this.dataSource.data.length > 0) {
      this.selectRow(this.dataSource.data[0]);
    }
  }

  // Форматирование даты в нужный формат
  formatDate(date: string): string {
    return this.datePipe.transform(date, 'dd.MM.yyyy') || 'Invalid Date';
  }

  // Редактирование документа
  editDocument(element: any) {
    const dialogRef = this.dialog.open(DocumentFormComponent, {
      width: '600px',
      data: { ...element },
    });

    dialogRef.componentInstance.documentSaved.subscribe((updatedDocument) => {
      const index = this.dataSource.data.findIndex(doc => doc === element);
      if (index > -1) {
        this.dataSource.data[index] = updatedDocument;
        this.dataSource._updateChangeSubscription();
      }
    });
  }

  // Удаление документа
  deleteDocument(element: any) {
    console.log('Deleting document:', element);
    this.dataSource.data = this.dataSource.data.filter(doc => doc !== element);
  }

  // Открытие формы документа
  openDocumentForm() {
    const dialogRef = this.dialog.open(DocumentFormComponent, {
      width: '600px',
    });

    dialogRef.componentInstance.documentSaved.subscribe((newDocument) => {
      this.dataSource.data = [...this.dataSource.data, newDocument];
    });
  }

  // Просмотр файла
  viewFile(element: any) {
    console.log(element);
    if (element.fileUrl) {
      window.open(element.fileUrl, '_blank');
    } else {
      console.error('No file URL found');
    }
  }

  // Проверяет, является ли строка текущей выбранной
  isSelectedRow(row: any): boolean {
    return this.dataSource.data.indexOf(row) === this.selectedRowIndex;
  }

  // Выбор строки по клику или программно
  selectRow(row: any) {
    this.selectedRowIndex = this.dataSource.data.indexOf(row);
    this.scrollToSelectedRow();  
  }

  // Навигация по строкам с клавиатуры
  onRowKeyDown(event: KeyboardEvent, row: any) {
    const rowIndex = this.dataSource.data.indexOf(row);

    if (event.key === 'ArrowDown' && this.selectedRowIndex < this.dataSource.data.length - 1) {
      this.selectedRowIndex++;
    } else if (event.key === 'ArrowUp' && this.selectedRowIndex > 0) {
      this.selectedRowIndex--;
    }

    this.selectRow(this.dataSource.data[this.selectedRowIndex]);
  }

  // Прокрутка к выбранной строке
  scrollToSelectedRow() {
    const selectedRow = document.querySelectorAll('tr.mat-row')[this.selectedRowIndex];
  }

  // Фокус на выбранной строке
  focusSelectedRow() {
    const rows = document.querySelectorAll('tr.mat-row');
    const selectedRow = rows[this.selectedRowIndex] as HTMLElement;
  }

  // Открывает диалоговое окно для печати документа с переданными данными
  openPrintDialog(element: any): void {
    const dialogRef = this.dialog.open(PrintDocumentComponent, {
      width: '600px',
      data: element
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Диалог закрыт', result);
    });
  }
}
