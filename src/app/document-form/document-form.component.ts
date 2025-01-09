import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common'; 
import { MatOptionModule } from '@angular/material/core';
import { EventEmitter, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function regNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return /[0-9]/.test(value) && /[A-Za-z]/.test(value) ? null : { regNumberInvalid: true };
  };
}

export function dateNotInFutureValidator(control: AbstractControl): ValidationErrors | null {
  const enteredDate = new Date(control.value);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  return enteredDate > currentDate ? { dateInFuture: true } : null;
}

export function executionDateValidator(regDateControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regDate = new Date(regDateControl.value);
    const executionDate = new Date(control.value);
    return executionDate < regDate ? { executionDateInvalid: true } : null;
  };
}

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
    MatOptionModule
  ],
})
export class DocumentFormComponent {
  form: FormGroup;
  isEditMode = false;
  fileError: string | null = null;
  isSaved = false;

  @Output() documentSaved = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<DocumentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      regNumber: ['', [Validators.required, regNumberValidator()]],
      regDate: ['', Validators.required],
      outDocNumber: ['', [Validators.required, regNumberValidator()]],
      outDocDate: ['', [Validators.required, dateNotInFutureValidator]],
      deliveryMethod: [''],
      correspondent: ['', Validators.required],
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(1000)],
      executionDate: ['', Validators.required],
      access: [false],
      control: [false],
      file: [null],
    });
  }

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];
    this.form.patchValue({
      regDate: today,
      outDocDate: today
    });

    this.form.get('executionDate')?.setValidators([
      Validators.required,
      executionDateValidator(this.form.get('regDate')!)
    ]);
    this.form.get('executionDate')?.updateValueAndValidity();

    if (this.data) {
      this.isEditMode = true;
      this.form.patchValue(this.data);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      const allowedFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 1 * 1024 * 1024;

      if (!allowedFormats.includes(file.type)) {
        this.fileError = 'Недопустимый формат. Только PDF, DOC, DOCX.';
        this.form.get('file')?.setValue(null);
        return;
      }

      if (file.size > maxSize) {
        this.fileError = 'Размер файла превышает 1Мб.';
        this.form.get('file')?.setValue(null);
        return;
      }

      this.fileError = null;
      this.form.get('file')?.setValue(file);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      if (this.isEditMode) {
        formData.id = this.data.id;
      }
      this.documentSaved.emit(formData);
      this.dialogRef.close();
      this.isSaved = true; 
      console.log('Form submitted:', formData);
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.form.get(controlName);
    if (!control) {
      return false;
    }
    return control.hasError(errorName) && control.touched;
  }
}