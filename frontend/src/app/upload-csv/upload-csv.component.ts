import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.css']
})
export class UploadCsvComponent {
  file: File | null = null;

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
          (response) => {
            console.log('File uploaded successfully', response);
          },
          (error) => {
            console.error('Error uploading file', error);
          }
        );
    } else {
      console.error('No file selected!');
    }
  }
}
