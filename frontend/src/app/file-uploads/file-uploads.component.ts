import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { faFileArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-file-uploads',
  templateUrl: './file-uploads.component.html',
  styleUrls: ['./file-uploads.component.scss'],
})
export class FileUploadsComponent implements OnChanges {
  @Input() multiple: boolean = false;
  @Input() btnName: string = 'Button';
  @Input() control?: FormControl<any>;
  public faFileArrowUp = faFileArrowUp;
  public faTrash = faTrash;

  public uploadControl: FormControl<any>;
  public files: Array<File> = [];

  constructor(private apiService: ApiService) {
    this.uploadControl = new FormControl<any>('');
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.files = [];
    let filenames = this.control?.value.map((f: any) => f.sysfilename);
    if (filenames.length) {
      this.apiService.getFiles(filenames).subscribe((res) => {
        let files = res.map((fileData, index) => {
          const blob = new Blob([fileData], {
            type: fileData.type || 'application/octet-stream',
          });
          const file: File = new File([blob], this.control?.value[index].name, {
            type: fileData.type || 'application/octet-stream',
          });
          return file;
        });
        this.files = [...files];
        this.control?.setValue([...files]);
      });
    }
  }
  public onSelectFile(event: any) {
    this.files = Array.from(event.target.files);

    if (!this.multiple && this.files.length > 1) {
      console.log('Multiple uploads are not allowed.');
      return;
    }

    const _fd = new FormData();
    let fileNames: Array<File> = [];
    for (let file of this.files) {
      _fd.append('_files', file);
      fileNames.push(file);
    }

    this.control?.setValue(fileNames);

    console.log('Found files to upload');
    this.uploadControl.setValue('');
  }

  public removeFile(index: number) {
    this.files.splice(index, 1);
    this.control?.setValue([...this.files]);
  }
}
