import { Location } from '@angular/common';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { CrossFieldErrorMatcher } from '../infrastructure/cross-field-error-matcher';
import { FormComponentBase } from '../infrastructure/form-component-base';
import { RouterModule, Routes, Router } from '@angular/router';
//model
import { Customer } from '../Models/customer.model';

//service
import { JobService } from '../shared/job.service';
import { CustomerAccountService } from '../shared/customer-account.service';

@Component({
  selector: 'app-customer-account',
  templateUrl: './customer-account.component.html',
  styleUrls: ['./customer-account.component.css']
})
export class CustomerAccountComponent extends FormComponentBase implements OnInit, AfterViewInit {

  jobList = [];

  customerForm: FormGroup;
  urlImage: any;
  base64textString: string;

  // @ViewChild('email') firstItem: ElementRef;

  errorMatcher = new CrossFieldErrorMatcher();


  constructor(private jobService: JobService,
    private customerAccountService: CustomerAccountService,
    private fb: FormBuilder,
    private location: Location,
    private router: Router) {
    super();

    this.validationMessages = {
      first_name: {
        required: 'First Name is required.',
        minlength: 'First Name minimum length is 2.',
        pattern: 'First Name minimum length 2, no special character.'
      },
      last_name: {
        required: 'Last Name is required.',
        minlength: 'Last Name minimum length is 2.',
        pattern: 'Last Name  minimum length 2, no special character.'
      },
      address: {
        minlength: 'Last Name minimum length is 2.',
        required: 'Address is required.'
      },
      city: {
        minlength: 'Last Name minimum length is 2.',
        required: 'City is required.'
      },
      email: {
        required: 'Email is required.',
        pattern: 'Email is not properly formatted.',
      },
      phone_number: {
        required: 'Phone number is required.',
        minlength: 'Phone number minimum length is 9.',
        maxlength: 'Phone number maximum length is 12.',
        pattern: 'Phone number minimum length 9, numbers only. No spaces.'
      },
      description: {
        required: 'Description is required.'
      }
    };

    this.formErrors = {
      first_name: '',
      last_name: '',
      address: '',
      city: '',
      email: '',
      phone_number: '',
      description: '',
    };


  }

  ngOnInit() {
    this.customerForm = this.fb.group({
      first_name: ['',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z]*$')
        ]
      ],
      last_name: ['',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z]*$')
        ]
      ],
      gender: ['Male'],
      address: ['',
        [
          Validators.required,
          Validators.minLength(2)
        ]

      ],
      city: ['',
        [
          Validators.required,
          Validators.minLength(2),
        ]
      ],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$")]
      ],
      phone_number: ['',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.pattern("^[0-9\-\+]{10,12}$")
        ]
      ],
      description: ['',
        [
          Validators.required,
        ]
      ],
      job_id: [1],
      imgUrl: []
    });

    this.jobService.getJobList().subscribe(
      res => this.jobList = res as []
    );

  }

  onFormSubmit() {
    let customer = this.customerForm.value;
    this.createCustomer(customer);

  }

  createCustomer(customer: Customer) {
    if (this.urlImage) {
      customer.imgUrl = this.urlImage;
    }
    console.log(customer);
    this.customerAccountService.createCustomer(customer).subscribe();
    this.confirmRedirect();
    // this.customerForm.reset();

  }

  onSelectFile(event) { // called each time file input changes
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        this.urlImage = (event.target as any).result;
      }
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.firstItem.nativeElement.focus();
    }, 250);
    this.startControlMonitoring(this.customerForm);
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
        this.router.navigate(['/listcustomer']);
      }
      else {
        this.customerForm.reset();
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
  goBack(): void {
    this.location.back();
  }


}
