import { JobService } from './../shared/job.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Customer } from './../Models/customer.model';
import { CustomerAccountService } from './../shared/customer-account.service';
import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { RouterModule, Routes, Router } from '@angular/router';
import { FormComponentBase } from '../infrastructure/form-component-base';
import { CrossFieldErrorMatcher } from '../infrastructure/cross-field-error-matcher';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css']
})
export class CustomerEditComponent extends FormComponentBase implements OnInit, AfterViewInit {
  jobList = [];
  customerList: Customer[] = [];
  // customerForm: FormArray = this.fb.array([]);
  customerForm: FormGroup;
  urlImage: any;
  base64textString: string;
  customer: Customer;
  errorMatcher = new CrossFieldErrorMatcher();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private customerAccountService: CustomerAccountService,
    private jobService: JobService,
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
        maxlength: 'Phone number maximum length is 12',
        pattern: 'Phone number minimum length 9, numbers only. No spaces.'
      },
      description: {
        minlength: 'Description minimum length is 2.',
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


    this.customerForm = this.fb.group({
      customer_id: ['', Validators.required],
      first_name: ['',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z0-9]*$')
        ]
      ],
      last_name: ['',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.pattern('^[a-zA-Z0-9]*$')
        ]
      ],
      gender: ['',
        [
          Validators.required
        ]

      ],
      address: ['',
        [
          Validators.required
        ]
      ],
      city: ['',
        [
          Validators.required
        ]
      ],
      email: ['',
        [
          Validators.required,
          Validators.email
        ]
      ],
      phone_number: ['',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(11),
          Validators.pattern("^[0-9\-\+]{10,12}$")
        ]
      ],
      description: ['',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],
      job_id: [1],
      imgUrl: []
    });
  }

  ngOnInit() {
    const customer_id = +this.route.snapshot.paramMap.get('customer_id');
    console.log(`this.route.snapshot.paramMap = ${JSON.stringify(this.route.snapshot.paramMap)}`);
    this.customerAccountService.getCustomerById(customer_id).subscribe((customer) => {
      this.customerForm = this.fb.group({
        customer_id: [
          customer.customer_id,
          Validators.required
        ],
        first_name: [
          customer.first_name,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('^[a-zA-Z]*$')
          ]
        ],
        last_name: [
          customer.last_name,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('^[a-zA-Z]*$')
          ]
        ],
        gender: ['Male'],
        address: [
          customer.address,
          [
            Validators.required,
            Validators.minLength(2)
          ]
        ],
        city: [
          customer.city,
          [
            Validators.required,
            Validators.minLength(2)
          ]
        ],
        email: [
          customer.email,
          [
            Validators.required,
            Validators.email,
            Validators.pattern("^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$")
          ]
        ],
        phone_number: [
          customer.phone_number,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.pattern("^[0-9\-\+]{10,12}$")
          ]
        ],
        description: [
          customer.description,
          [
            Validators.required,
            Validators.minLength(2)
          ]
        ],
        job_id: [1],
        imgUrl: [customer.imgUrl]
      });
      if (customer.imgUrl !== null) {
        this.urlImage = customer.imgUrl;
      }
    });

    //job Service
    this.jobService.getJobList().subscribe(
      res => this.jobList = res as []
    );
  }

  onFormSubmit() {

    let customer = this.customerForm.value;
    if (this.urlImage) {
      customer.imgUrl = this.urlImage;
    }
    console.log(this.customerForm.value);
    this.customerAccountService.editCustomer(customer).subscribe();
    this.successfully();
    // this.customerForm.reset();
  }


  successfully(): void {
    Swal.fire({
      icon: 'success',
      title: 'Successfully !',
      text: 'Updated Successfully !',
    })
  }
  deleteCustomer(customer_id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Deleted!',
          'Your file has been deleted!',
          'success'
        ), this.customerAccountService.deleteCustomter(customer_id).subscribe();
        this.ngOnInit();
      }
    })

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.firstItem.nativeElement.focus();
    }, 250);
    this.startControlMonitoring(this.customerForm);
  }


  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);

      reader.onload = (event) => {
        this.urlImage = (event.target as any).result;
      }
    }
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
        this.router.navigate(['/listcustomer']);
      }
    })
  }

  goBack(): void {
    this.location.back();
  }

}
