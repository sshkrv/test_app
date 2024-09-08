import { Routes } from '@angular/router';
import { UploadCsvComponent } from './upload-csv/upload-csv.component';
import { ListCsvComponent } from './list-csv/list-csv.component';
import { PreviewCsvComponent } from './preview-csv/preview-csv.component';
import { EnrichCsvComponent } from './enrich-csv/enrich-csv.component';

export const routes: Routes = [
  { path: 'upload', component: UploadCsvComponent },
  { path: 'files', component: ListCsvComponent },
  { path: 'preview/:file_id', component: PreviewCsvComponent },
  { path: 'enrich/:fileId', component: EnrichCsvComponent },
  { path: '', redirectTo: '/upload', pathMatch: 'full' },
];
