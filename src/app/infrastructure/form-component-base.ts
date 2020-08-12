import { ViewChildren, ElementRef } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class FormComponentBase {

    numberDate = Date.now();
    
    test:"2020-12-31";
  
    todaysdate = (new Date(this.numberDate).getFullYear()) + '-' + ('0' + (new Date(this.numberDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(this.numberDate).getDate()).slice(-2);

    todaysdateExpiration = (new Date(this.test).getFullYear()) + '-' + ('0' + (new Date(this.test).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(this.test).getDate()).slice(-2);

    dateSent=(new Date(this.numberDate).getFullYear()-3)+'-'+('0' + new Date(this.numberDate).getMonth()).slice(-2)+'-'+('0' + new Date(this.numberDate).getDate()).slice(-2);   
 
    datePast=(new Date(this.numberDate).getFullYear()-100)+'-'+('0' + new Date(this.numberDate).getMonth()).slice(-2)+'-'+('0' + new Date(this.numberDate).getDate()).slice(-2);  

    dateExpiration=(new Date(this.test).getFullYear()) + '-' + ('0' + (new Date(this.test).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(this.test).getDate()).slice(-2);   
    // @ts-ignore
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    public validationMessages: { [key: string]: { [key: string]: string } } = {};
    public formErrors: { [key: string]: string } = {};

    protected startControlMonitoring(form: FormGroup): void {
        // Watch for the blur event from any input element on the form.
        //  This is required because the valueChanges does not provide notification on blur.
        const controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

        // Merge the blur event observable with the valueChanges observable so we only need to subscribe once.
        merge(form.valueChanges, ...controlBlurs).pipe(
            debounceTime(300)
        ).subscribe(value => {
            this.logValidationErrors(form);
        });
    }

    private logValidationErrors(group: FormGroup): void {

        Object.keys(group.controls).forEach((key: string) => {
            const abstractControl = group.get(key);

            this.formErrors[key] = '';

            if (abstractControl && !abstractControl.valid && (abstractControl.touched || abstractControl.dirty)) {
                const messages = this.validationMessages[key];
                for (const errorKey in abstractControl.errors) {
                    if (errorKey) {
                        this.formErrors[key] += messages[errorKey] + ' ';
                    }
                }
            }
            if (abstractControl instanceof FormGroup) {
                this.logValidationErrors(abstractControl);
            }
        });
    }
}