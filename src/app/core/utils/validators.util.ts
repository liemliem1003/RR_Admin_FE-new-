// src/app/utils/validators.util.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Validator: kiểm tra email
export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value) ? { emailInvalid: true } : null;
  };
}

// Validator: password >= 6 ký tự
export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value && value.length < 6 ? { passwordTooShort: true } : null;
  };
}
