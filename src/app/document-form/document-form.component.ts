import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


@Component({
  selector: 'app-document-form',
  standalone: true,
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatOptionModule,
  ],
})

export class DocumentFormComponent {
  form: FormGroup;
  isEditMode = false;
  fileError: string | null = null;
  isSaved = false;
  submitted = false;
  selectedFile: File | null = null;
  selectedFileName: string = 'Файл не выбран';

  @Output() documentSaved = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DocumentFormComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      regNumber: ['', [Validators.required, this.regNumberValidator]],
      regDate: ['', Validators.required],
      outDocNumber: ['', [Validators.required, this.regNumberValidator]],
      outDocDate: ['', [Validators.required, this.dateNotInFutureValidator]],
      deliveryMethod: ['', Validators.required],
      correspondent: ['', Validators.required],
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(1000)],
      executionDate: ['', Validators.required],
      access: [false],
      control: [false],
      file: [null],
    });
  }

  // Инициализация значений формы
  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.form.patchValue({
      regDate: today,
      outDocDate: today
    });

    if (!this.isEditMode) {
      this.setExecutionDateValidators();
    }

    if (this.data) {
      this.isEditMode = true;
      this.form.patchValue(this.data);
    }
  }

  // Установка валидаторов для поля executionDate
  private setExecutionDateValidators(): void {
    const executionDateControl = this.form.get('executionDate');
    executionDateControl?.setValidators([
      Validators.required,
      this.executionDateNotBeforeRegistrationValidator('regDate')
    ]);
    executionDateControl?.updateValueAndValidity();
  }

  // Обработчик изменения файла
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const allowedFormats = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      const maxSize = 1 * 1024 * 1024; // 1 MB

      if (!allowedFormats.includes(file.type)) {
        this.fileError = 'Недопустимый формат. Только PDF, DOC, DOCX.';
        this.selectedFileName = 'Файл не выбран';
        this.form.get('file')?.setValue(null);
        return;
      }

      if (file.size > maxSize) {
        this.fileError = 'Размер файла превышает 1Мб.';
        this.selectedFileName = 'Файл не выбран';
        this.form.get('file')?.setValue(null);
        return;
      }

      this.fileError = null;
      this.selectedFileName = file.name;
      this.form.get('file')?.setValue(file);
    } else {
      this.selectedFileName = 'Файл не выбран';
      this.form.get('file')?.setValue(null);
    }
  }

  // Отправка данных формы
  onSubmit() {
    this.submitted = true;

    if (this.form.valid) {
      const formData = { ...this.form.value };

      if (this.isEditMode) {
        formData.id = this.data.id;
      }

      if (this.form.get('file')?.value) {
        const file = this.form.get('file')?.value;
        formData.fileUrl = URL.createObjectURL(file);
      }

      this.documentSaved.emit(formData);
      this.dialogRef.close();
      this.isSaved = true;
      console.log('Form submitted:', formData);
    }
  }

  // Закрытие диалогового окна
  onClose() {
    this.dialogRef.close();
  }

  // Валидатор для даты (не может быть в будущем)
  dateNotInFutureValidator(control: AbstractControl): ValidationErrors | null {
    const enteredDate = new Date(control.value).toDateString();
    const today = new Date().toDateString();
    return enteredDate > today ? { isDateNotInFuture: true } : null;
  }

  // Валидатор для регистрационного номера
  regNumberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    return /[0-9]/.test(value) && /[A-Za-z]/.test(value)
      ? null
      : { regNumberInvalid: true };
  }

  // Проверка наличия ошибки в поле
  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    return control ? control.hasError(errorName) && control.touched : false;
  }

  // Валидатор для поля executionDate (не может быть раньше regDate)
  executionDateNotBeforeRegistrationValidator(regDateControlName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const regDate = control.root.get(regDateControlName)?.value;
      const executionDate = control.value;

      if (!regDate || !executionDate) return null;

      const regDateObj = new Date(regDate);
      const executionDateObj = new Date(executionDate);

      return executionDateObj < regDateObj ? { executionDateInvalid: true } : null;
    };
  }
}
