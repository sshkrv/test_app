import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface FileResponse {
  id: number;
  filename: string;
  uploaded_at: string;
}

@Component({
  selector: 'app-list-csv',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-csv.component.html',
  styleUrls: ['./list-csv.component.css']
})
export class ListCsvComponent implements OnInit {
  files: FileResponse[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<FileResponse[]>('http://localhost:8000/csv/files/')
      .subscribe(
        (response) => {
          this.files = response;
        },
        (error) => {
          console.error('Error fetching files', error);
        }
      );
  }
}
