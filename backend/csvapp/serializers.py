from rest_framework import serializers
from .models import UploadedCSV

class UploadedCSVSerializer(serializers.ModelSerializer):
    class Meta:
        model = UploadedCSV
        fields = ['id', 'file', 'filename', 'uploaded_at']  # Ensure 'file' is included here
