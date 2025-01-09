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
import { MAT_DIALOG_DATA } from '@angular/material/dialog';  // Import MAT_DIALOG_DATA
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function regNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    // Check if the value contains a digit
    const containsDigit = /[0-9]/.test(value);
    // Check if the value contains a letter
    const containsLetter = /[A-Za-z]/.test(value);
    
    if (!containsDigit) {
      return { regNumberNoDigit: true }; // Error for no digit
    }

    if (!containsLetter) {
      return { regNumberNoLetter: true }; // Error for no letter
    }
    
    return null; // Valid if both conditions are met
  };
}

export function dateNotInFutureValidator(control: AbstractControl): ValidationErrors | null {
  const enteredDate = new Date(control.value);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time for comparison (consider only date part)

  if (enteredDate > currentDate) {
    return { dateInFuture: true }; // Error if date is in the future
  }
  return null; // Valid date
}

export function executionDateValidator(regDateControl: AbstractControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regDate = regDateControl.value;
    const executionDate = control.value;

    if (!regDate || !executionDate) {
      return null; // If either of the dates is not set, don't validate
    }

    const regDateObj = new Date(regDate);
    const executionDateObj = new Date(executionDate);

    if (executionDateObj < regDateObj) {
      return { executionDateInvalid: true }; // Error if execution date is earlier than registration date
    }

    return null; // Valid if execution date is equal to or later than registration date
  };
}

@Component({
  selector: 'app-document-form',
  standalone: true,
  templateUrl: './document-form.component.html',
  styleUrls: ['./document-form.component.css'],
  imports: [
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
    CommonModule,
    MatOptionModule
  ],
})
export class DocumentFormComponent {
  form: FormGroup;
  isEditMode: boolean = false;
  fileError: string | null = null;  // File error message

  @Output() documentSaved = new EventEmitter<any>();

  constructor(private fb: FormBuilder, 
    public dialogRef: MatDialogRef<DocumentFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any  ) {
    this.form = this.fb.group({
      regNumber: ['', [Validators.required, regNumberValidator()]],
      regDate: [ '', Validators.required],
      outDocNumber: ['', [Validators.required, regNumberValidator()]],
      outDocDate: ['', [Validators.required, dateNotInFutureValidator]],
      deliveryMethod: [''],
      correspondent: ['', Validators.required],
      subject: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(1000)]],
      executionDate: ['', [Validators.required]],
      access: [false],
      control: [false],
      file: [null],
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      
      // Validate file format (PDF, DOC, DOCX)
      const allowedFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 1 * 1024 * 1024; // 1MB in bytes
  
      // If the file type is not supported, reset the file input and return
      if (!allowedFormats.includes(file.type)) {
        this.fileError = 'Недопустимый формат. Только PDF, DOC, DOCX.';
        this.form.get('file')?.setValue(null);  // Reset file input
        return; // Ignore unsupported file types
      }
  
      // If file size is greater than allowed, reset the file input and return
      if (file.size > maxSize) {
        this.fileError = 'Размер файла превышает 1Мб.';
        this.form.get('file')?.setValue(null);  // Reset file input
        return; // Ignore file if size is too large
      }
  
      // Clear any previous errors if file is valid
      this.fileError = null; 
      this.form.get('file')?.setValue(file);  // Save the valid file to the form
    }
  }
  
  

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;

      // If it's edit mode, you may want to update the existing data, 
      // otherwise emit new data
      if (this.isEditMode) {
        // Optionally, you can add an ID to indicate the document is being edited
        formData.id = this.data.id; // Add the ID if needed
      }

      // Emit the form data to the parent component
      this.documentSaved.emit(formData);

      // Close the dialog automatically after saving
      this.dialogRef.close();
      console.log('Form submitted:', formData);
    }
  }

  onClose() {
    // Close the form
    this.dialogRef.close();
  }

  ngOnInit(): void {
    const today = new Date().toISOString().split('T')[0];  // Get today's date
    this.form.get('regDate')?.setValue(today);  // Set today's date in regDate field
    this.form.get('outDocDate')?.setValue(today);  // Set today's date in outDocDate field

    // Dynamically apply the executionDateValidator after the form is initialized
    this.form.get('executionDate')?.setValidators([Validators.required, executionDateValidator(this.form.get('regDate')!)]);
    this.form.get('executionDate')?.updateValueAndValidity(); // Trigger revalidation

    if (this.data) {
      this.isEditMode = true;
      this.form.patchValue(this.data);
    }
  }

}
