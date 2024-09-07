import { Routes } from '@angular/router';
import { UploadCsvComponent } from './upload-csv/upload-csv.component';
import { ListCsvComponent } from './list-csv/list-csv.component';

export const routes: Routes = [
  { path: 'upload', component: UploadCsvComponent },
  { path: 'files', component: ListCsvComponent },
  { path: '', redirectTo: '/upload', pathMatch: 'full' },
];
