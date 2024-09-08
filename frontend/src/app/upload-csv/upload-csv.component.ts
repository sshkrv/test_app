import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-csv',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent {
  file: File | null = null;
  successMessage = '';
  errorMessage = '';
  uploadedFileId: number | null = null;
  uploadedFileName: string | null = null;

  constructor(private http: HttpClient, private configService: ConfigService) {}

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  uploadCsv() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);

      const apiUrl = this.configService.getApiUrl();

      this.http.post(`${apiUrl}/csv/upload/`, formData)
        .subscribe(
          (response: any) => {
            this.successMessage = 'File uploaded successfully!';
            this.uploadedFileId = response.id;
            this.uploadedFileName = response.filename;
          },
          (error) => {
            console.error('Error uploading file', error);
            this.errorMessage = 'Error uploading file.';
          }
        );
    } else {
      this.errorMessage = 'No file selected!';
    }
  }
}
