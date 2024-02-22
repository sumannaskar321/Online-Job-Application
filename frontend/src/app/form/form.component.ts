import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnChanges, OnInit {
  @Input() mode: string = 'add';
  @Input() editData!: object;
  @Output() reload: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('description')
  public editor = ClassicEditor;
  public _form: FormGroup;
  public submitted: boolean;

  constructor(private apiService: ApiService) {
    this._form = this.getFormInit();

    this.submitted = false;
  }
  ngOnInit(): void {
    if (this.editData) {
      //   setTimeout(() => {
      this._form.patchValue({ ...this.editData });
      //   }, 0);
    }
  }

  private getFormInit() {
    return new FormGroup<any>({
      name: new FormControl<string>('', [Validators.required]),
      dob: new FormControl<string>('', [Validators.required]),
      city: new FormControl<string>('', [Validators.required]),
      resume: new FormControl<any[]>([], [Validators.maxLength(1)]),
      additional_doc: new FormControl<any[]>([]),
      phone_no: new FormControl<string>('', [
        Validators.required,
        Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$'),
      ]),
      description: new FormControl<string>(''),
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.submitted = false;
  }

  public onSubmit() {
    console.log(this._form.value);
    if (this._form.invalid) return;
    this.submitted = true;
    const _fd = new FormData();
    let data = this._form.getRawValue();

    let files: File[] = data.additional_doc;
    for (let i = 0; i < files.length; i++) {
      const element = files[i];
      _fd.append('_files', element);
    }

    for (let i = 0; i < data.resume.length; i++) {
      const element = data.resume[i];
      _fd.append('_file', element);
    }

    _fd.append('name', data.name);
    _fd.append('dob', data.dob);
    _fd.append('city', data.city);
    _fd.append('phone_no', data.phone_no);
    _fd.append('description', data.description);

    if (this.mode === 'add') {
      this.apiService.addApplication(_fd).subscribe({
        next: (res) => {
          alert('Application submitted successfully.');
          this.reload.emit(true);
        },
        error: (err) => {
          alert('Unable to Submit. Something went wrong');
          this.reload.emit(false);
          console.log('err=> ', err);
        },
      });
    } else {
      _fd.append('_id', (this.editData as any)._id);
      this.apiService.editApplication(_fd).subscribe({
        next: (res) => {
          alert('Application Edited successfully.');
          this.reload.emit(true);
        },
        error: (err) => {
          alert('Unable to Submit. Something went wrong');
          this.reload.emit(false);
          console.log('err=> ', err);
        },
      });
    }
    // this.editData = {};
  }

  public getControl(key: string) {
    return this._form.controls[key] as FormControl<any>;
  }

  public onCancle() {
    this.reload.emit(false);
    // this.editData = {};
    this._form = this.getFormInit();
  }
}
