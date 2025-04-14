import { Validators } from "@angular/forms";
import { VALIDATION } from "../../shared/validators/validators";


/**
 * RIDER_BASE_FORM
 * ---------------------------
 * Contains the core fields for rider registration and update forms.
 * Includes validation rules for inputs like username, contact info, and address.
 */

export const RIDER_BASE_FORM = {
    username: ['', [Validators.required, Validators.minLength(5)]],
    firstName: ['', [Validators.required, Validators.minLength(5)]],
    lastName: ['', [Validators.required, Validators.minLength(5)]],
    phoneNumber: ['', [
      Validators.required,
      Validators.minLength(11),
      Validators.pattern(VALIDATION.PHONE.PATTERN)
    ]],
    email: ['', [
      Validators.required,
      Validators.pattern(VALIDATION.EMAIL.PATTERN)
    ]],
    cnicNumber: ['', [
      Validators.required,
      Validators.pattern(VALIDATION.CNIC.PATTERN)
    ]],
    address: ['', [Validators.required, Validators.maxLength(50)]],
    sector: ['', [Validators.required, Validators.maxLength(10)]],
    street: ['', [Validators.required, Validators.minLength(10)]]
  };


  /**
 * RIDER_ORG_FORM
 * ----------------------------
 * Fields for associating the rider with an organization and role.
 * Used in both rider creation and update forms.
 */
  
  export const RIDER_ORG_FORM = {
    role: ['', [Validators.required]],
    organization: ['', [Validators.required]],
    organizationId: ['']
  };