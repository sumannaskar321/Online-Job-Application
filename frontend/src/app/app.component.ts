import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './services/api.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

interface IApplication {
  name: string;
  dob: string;
  city: string;
  resume: string[];
  additional_doc: string[];
  phone_no: string;
  description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend';
  public mode: string | null = null;
  displayedColumns: string[] = [
    'name',
    'dob',
    'city',
    '_resume',
    '_additional_doc',
    'phone_no',
    'description',
  ];
  dataSource!: MatTableDataSource<IApplication>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public applications = [];
  public editApplication!: object;

  constructor(private apiService: ApiService) {}
  ngOnInit(): void {
    this.loadApplications();
  }

  public toggleMode(mode: string): void {
    this.mode = mode;
  }

  public doReload(status: boolean) {
    this.mode = null;
    this.editApplication = {};
    if (status) {
      this.loadApplications();
    }
  }

  public loadApplications() {
    this.apiService.getApplications().subscribe({
      next: (res) => {
        this.applications = res;
        let data = res.map((d: any) => {
          return {
            ...d,
            _resume: d.resume.map((f: any) => f.name),
            _additional_doc: d.additional_doc.map((f: any) => f.name),
          };
        });
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: console.log,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource?.paginator) {
      this.dataSource?.paginator.firstPage();
    }
  }

  public editClicked(row: object) {
    this.editApplication = row;
    this.mode = 'edit';
  }
}
