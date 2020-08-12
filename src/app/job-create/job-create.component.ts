import { FormComponentBase } from './../infrastructure/form-component-base';
import { CrossFieldErrorMatcher } from './../infrastructure/cross-field-error-matcher';

import { Location } from '@angular/common';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

//model
import { Customer } from '../Models/customer.model';
import { Job } from './../Models/job.model';
import { RouterModule, Routes, Router } from '@angular/router';

//service
import { JobService } from '../shared/job.service';
import { CustomerAccountService } from '../shared/customer-account.service';

@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.css']
})
export class JobCreateComponent extends FormComponentBase implements OnInit, AfterViewInit {

  customerList = [];
  jobForm: FormGroup;
  errorMatcher = new CrossFieldErrorMatcher();
  constructor(private jobService: JobService,
    private customerAccountService: CustomerAccountService,
    private location: Location,
    private fb: FormBuilder,
    private router: Router) {
    super();

    this.validationMessages = {
      job_code: {
        required: 'Code is required.',
        minlength: 'Code minimum length is 2.',
        pattern: 'Code minimum length 2, no special character.'
      },
      job_name: {
        required: 'Name is required.',
        minlength: 'Name minimum length is 2.',
      },
      job_description: {
        required: 'Description is required.',
        minlength: 'Description minimum length is 2.',       
      },
    };

    this.formErrors = {
      job_code: '',
      job_name: '',
      job_description: ''
    }
  }


  ngOnInit() {
    this.jobForm = this.fb.group({
      job_code: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z0-9]*$')
        ]
      ],

      job_name: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      job_description: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ]
    });

    this.customerAccountService.getCustomerList().subscribe(
      res => this.customerList = res as []
    )
  }

  onFormSubmit() {
    let job = this.jobForm.value;
    this.createJob(job);
  }

  createJob(job: Job) {
    this.jobService.createJob(job).subscribe(
      (data) => { console.log(data) }
    );
    console.log(job);
    this.confirmRedirect();

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.firstItem.nativeElement.focus();
    }, 250);
    this.startControlMonitoring(this.jobForm);
  }

  goBack(): void {
    this.location.back();
  }



  ///Alert 
  successfully(): void {
    Swal.fire({
      icon: 'success',
      title: 'Successfully !',
      text: 'Created Successfully !',
    })
  }

  confirmRedirect(): void {
    Swal.fire({
      title: 'Success',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#FF7F50',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Back To List',
      cancelButtonText: 'Continue'
    }).then((result) => {
      if (result.value) {
        this.router.navigate(['/joblist']);
      }
      else {
        this.jobForm.reset();
        return;
      }
    })
  }

  cancel(): void {
    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.location.back();
      }
    })
  }
  // 


}



