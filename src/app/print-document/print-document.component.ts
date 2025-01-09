import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-print-document',
  standalone: true,
  templateUrl: './print-document.component.html',
  styleUrls: ['./print-document.component.css'],
  imports: [CommonModule], 
  providers: [DatePipe] 
})
export class PrintDocumentComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe 
  ) {}

  // Method to handle printing
  printDocument() {
    const regDateFormatted = this.datePipe.transform(this.data.regDate, 'dd.MM.yyyy');
    const outDocDateFormatted = this.datePipe.transform(this.data.outDocDate, 'dd.MM.yyyy');

    const printWindow = window.open('', '', 'width=800,height=600');

    if (printWindow) {  
      printWindow.document.write('<html><head><title>Печать документа</title></head><body>');
      printWindow.document.write('<h1>Печать документа</h1>');
      printWindow.document.write(`<p><strong>Рег. №:</strong> ${this.data.regNumber}</p>`);
      printWindow.document.write(`<p><strong>Дата рег.:</strong> ${regDateFormatted}</p>`);
      printWindow.document.write(`<p><strong>№ исх. док-та:</strong> ${this.data.outDocNumber}</p>`);
      printWindow.document.write(`<p><strong>Дата исх. док-та:</strong> ${outDocDateFormatted}</p>`);
      printWindow.document.write(`<p><strong>Корреспондент:</strong> ${this.data.correspondent}</p>`);
      printWindow.document.write(`<p><strong>Тема:</strong> ${this.data.subject}</p>`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error('Failed to open print window');
    }
  }
}
