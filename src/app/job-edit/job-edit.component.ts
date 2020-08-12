import { FormComponentBase } from './../infrastructure/form-component-base';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
//library
import Swal from 'sweetalert2';
//model
import { Job } from '../Models/job.model';
//service
import { CustomerAccountService } from './../shared/customer-account.service';
import { JobService } from './../shared/job.service';
import { ReportService } from '../shared/report.service';




@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.css']
})
export class JobEditComponent extends FormComponentBase implements OnInit, AfterViewInit {

  jobList: Job[] = [];
  job: Job;
  jobForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private customerAccountService: CustomerAccountService,
    private jobService: JobService,
    private reportService: ReportService,
  ) {
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
        pattern: 'Name minimum length 2, no special character.'
      },
      job_description: {
        required: 'Description is required.',
        minlength: 'Description minimum length is 2.',
        pattern: 'Description minimum length 2, no special character.'
      },
    };

    this.formErrors = {
      job_code: '',
      job_name: '',
      job_description: ''
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      // this.firstItem.nativeElement.focus();
    }, 250);
    this.startControlMonitoring(this.jobForm);
  }

  ngOnInit() {
    const job_id = +this.route.snapshot.paramMap.get('job_id');
    console.log(`this.route.snapshot.paramMap = ${JSON.stringify(this.route.snapshot.paramMap)}`);
    this.jobService.getJobById(job_id).subscribe((job) => {
      this.jobForm = this.fb.group({
        job_id: [job_id, Validators.required],
        job_code: [job.job_code,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern('^[a-zA-Z0-9]*$')
          ]
        ],
        job_name: [job.job_name,
          [
            Validators.required,
            Validators.minLength(2)
          ]
        ],
        job_description: [job.job_description, 
          [
            Validators.required,
            Validators.minLength(2)
          ]
        ]
      })
    });
  }
  onFormSubmit() {
    let job = this.jobForm.value;
    console.log(this.jobForm.value);
    this.jobService.editJob(job).subscribe();
    this.successfully();
    // this.customerForm.reset();

  }

  // deleteJob(job_id) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: "You won't be able to revert this!",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Yes, delete it!'
  //   }).then((result) => {
  //     if (result.value) {
  //       Swal.fire(
  //         'Deleted!',
  //         'Your file has been deleted!',
  //         'success'
  //       ),
  //       this.jobService.deleteJob(job_id).subscribe(
  //         (data) => { console.log(data) }
  //       );
  //         this.ngOnInit();
  //     }
  //   })
  // }



  ///Alert 
  successfully(): void {
    Swal.fire({
      icon: 'success',
      title: 'Successfully !',
      text: 'Created Successfully !',
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
