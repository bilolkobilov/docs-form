import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    private datePipe: DatePipe, 
    private dialogRef: MatDialogRef<PrintDocumentComponent>  
  ) { }

  // Метод для печати документа
  printDocument() {
    // Форматируем даты
    const regDateFormatted = this.datePipe.transform(this.data.regDate, 'dd.MM.yyyy');
    const outDocDateFormatted = this.datePipe.transform(this.data.outDocDate, 'dd.MM.yyyy');

    // Создаем iframe для печати
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    // Получаем доступ к содержимому iframe
    const iframeDocument = iframe.contentWindow?.document;

    if (iframeDocument) {
      // Открываем и записываем содержимое документа в iframe
      iframeDocument.open();
      iframeDocument.write('<html><head><title>Печать документа</title>');
      iframeDocument.write('<style>');
      iframeDocument.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
      iframeDocument.write('table, th, td { border: 1px solid #ddd; }');
      iframeDocument.write('th, td { padding: 8px; text-align: left; }');
      iframeDocument.write('th { background-color: #f4f4f4; font-weight: bold; }');
      iframeDocument.write('</style></head><body>');

      // Вставляем данные документа в таблицу
      iframeDocument.write('<h1>Печать документа</h1>');
      iframeDocument.write('<table>');
      iframeDocument.write('<tr><th>Рег. №</th><td>' + this.data.regNumber + '</td></tr>');
      iframeDocument.write('<tr><th>Дата рег.</th><td>' + regDateFormatted + '</td></tr>');
      iframeDocument.write('<tr><th>№ исх. док-та</th><td>' + this.data.outDocNumber + '</td></tr>');
      iframeDocument.write('<tr><th>Дата исх. док-та</th><td>' + outDocDateFormatted + '</td></tr>');
      iframeDocument.write('<tr><th>Корреспондент</th><td>' + this.data.correspondent + '</td></tr>');
      iframeDocument.write('<tr><th>Тема</th><td>' + this.data.subject + '</td></tr>');
      iframeDocument.write('</table>');

      iframeDocument.write('</body></html>');
      iframeDocument.close();

      // Печатаем документ
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      // Убираем iframe после печати
      document.body.removeChild(iframe);

      // Закрываем модальное окно
      this.dialogRef.close();
    } else {
      console.error('Не удалось получить доступ к contentWindow iframe');
    }
  }

  // Метод для закрытия модального окна
  close() {
    this.dialogRef.close();
  }
}
