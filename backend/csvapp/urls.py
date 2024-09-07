from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.upload_csv, name='upload_csv'),
    path('files/', views.list_csv_files, name='list_csv_files'),
    path('preview/<int:file_id>/', views.preview_csv, name='preview_csv'),
]
