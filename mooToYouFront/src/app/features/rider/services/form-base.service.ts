import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Organization } from "../../shared/interfaces/organization.interface";
import { NotificationService } from "../../shared/services/notification.service";
import { LoggerService } from "../../shared/services/logger.service";
import { RIDER_BASE_FORM, RIDER_ORG_FORM } from "../configs/rider-form.config";
import { VALIDATION } from "../../shared/validators/validators";

/**
 * FormBaseService
 * --------------------------
 * Abstract base class for shared rider form logic.
 * Includes form creation, validation, organization binding, and error handling.
 */


export abstract class FormBaseService
{
     /** Shared reactive form instance (rider-create/update) */
    protected form!:FormGroup;

     /** Static list of organization options */
    organizations:Organization[]=[
        {value:'emaanDairy', label: 'Emaan Dairy', id:1},
        {value:'newDairy', label: 'New Dairy', id:2}
    ];

    constructor(
        protected fb:FormBuilder,
        protected notification:NotificationService,
        protected logger:LoggerService,
        protected includePassword: boolean=false // Determines whether to include password field
    ){
        this.form= this.creatBaseForm();
    }

     /**
   * Creates base form group with default fields.
   * Conditionally adds password if required.
   */

    protected creatBaseForm():FormGroup{

        const baseConfig: { [key: string]: any } = {
            ...RIDER_BASE_FORM,
            ...RIDER_ORG_FORM
        };

        if(this.includePassword){
            baseConfig['password']=['',[
                Validators.required,
                Validators.minLength(VALIDATION.PASSWORD.MIN_LENGTH),
                Validators.pattern(VALIDATION.PASSWORD.PATTERN)
            ]];
        }

        return this.fb.group(baseConfig);

    }

    /**
   * Binds the selected organization to its ID dynamically.
   * Keeps form data normalized.
   */

    protected setupOrganizationListener():void{
        this.form.get('organization')?.valueChanges.subscribe(selectedOrg=>{
            const org = this.organizations.find(o=>o.value === selectedOrg);
            this.form.get('organizationId')?.setValue(org?.id || null);
        })
    }


    /**
   * Logs error and shows a notification.
   * @param error - The caught error object
   * @param context - Context message to clarify the operation
   */

    protected handleFormError(error:any, context:string): void{
        this.logger.error(`${context} failed`, error);
        this.notification.show(`Failed to ${context}`);
    }


     /**
   * Validates form and notifies user if invalid.
   * @param context - Used in the warning message
   * @returns true if form is valid, false otherwise
   */
  
    protected validateForm(context:string): boolean
    {
        if(this.form.invalid){
            this.notification.show(`please fix form errors before ${context} `);
            return false;
        }
        return true;
    }
    
}