import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preview-csv',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './preview-csv.component.html',
  styleUrls: ['./preview-csv.component.css']
})
export class PreviewCsvComponent implements OnInit {
  csvData: any[][] = [];
  fileName: string = '';
  fileId: number | undefined = undefined;

  constructor(private http: HttpClient, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('Route params:', params);
      const id = params['file_id'];
      this.fileId = Number(id);
      console.log('File ID:', this.fileId);
      if (!isNaN(this.fileId)) {
        // Fetch the preview CSV data
        console.log(`Sending request to fetch data for file ID: ${this.fileId}`);
        this.http.get<any>(`http://localhost:8000/csv/preview/${this.fileId}/`)
          .subscribe(
            (response) => {
              console.log('Preview data:', response);
              this.csvData = response.data;
              this.fileName = response.filename;
            },
            (error) => {
              console.error('Error fetching preview data', error);
            }
          );
      }
    });
  }
}
