import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-enrich-csv',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './enrich-csv.component.html',
  styleUrls: ['./enrich-csv.component.css']
})
export class EnrichCsvComponent implements OnInit {
  form: FormGroup;
  csvColumns: string[] = [];
  isLoading = false;
  successMessage = '';
  errorMessage = '';
  enrichmentMessage = '';
  enrichedFileId: number | null = null;
  enrichedFileName: string | null = null;
  fileId: number | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private fb: FormBuilder) {
    this.form = this.fb.group({
      apiUrl: '',
      csvKey: '',
      apiKey: ''
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.fileId = +params['fileId'];
      if (this.fileId) {
        this.fetchCsvColumns();
      }
    });
  }

  fetchCsvColumns(): void {
    if (this.fileId) {
      this.isLoading = true;
      this.http.get<{ headers: string[] }>(`http://localhost:8000/csv/preview/${this.fileId}/`)
        .subscribe(
          (response) => {
            this.csvColumns = response.headers;
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching CSV columns', error);
            this.isLoading = false;
          }
        );
    }
  }

  enrichCsv(): void {
    if (this.form.valid && this.fileId) {
      const formData = this.form.value;
      formData.fileId = this.fileId;

      this.http.post('http://localhost:8000/csv/enrich/', formData)
        .subscribe(
          (response: any) => {
            this.enrichmentMessage = `${response.message} File: ${response.filename}`;
            this.enrichedFileId = response.file_id;
            this.enrichedFileName = response.filename;
          },
          (error) => {
            console.error('Error enriching CSV file', error);
            this.errorMessage = 'Error enriching CSV file.';
          }
        );
    }
  }
}
