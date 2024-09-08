from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UploadedCSV
from .serializers import UploadedCSVSerializer
from django.core.files import File
from django.conf import settings
import requests
import csv
import os

@api_view(['POST'])
def upload_csv(request):
    data = request.data.copy()
    data['file'] = request.FILES.get('file')

    serializer = UploadedCSVSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def preview_csv(request, file_id):
    try:
        uploaded_csv = UploadedCSV.objects.get(id=file_id)
        with open(uploaded_csv.file.path, 'r') as file:
            reader = csv.reader(file)
            data = list(reader)

        headers = data[0]
        rows = data

        return Response({'headers': headers, 'data': rows, 'filename': uploaded_csv.filename})
    except UploadedCSV.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def list_csv_files(request):
    files = UploadedCSV.objects.all()
    serializer = UploadedCSVSerializer(files, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def enrich_csv(request):
    api_url = request.data.get('apiUrl')
    csv_key = request.data.get('csvKey')
    api_key = request.data.get('apiKey')
    file_id = request.data.get('fileId')

    try:
        uploaded_csv = UploadedCSV.objects.get(id=file_id)
        csv_file_path = uploaded_csv.file.path
    except UploadedCSV.DoesNotExist:
        return Response({"error": "CSV file not found"}, status=status.HTTP_404_NOT_FOUND)

    try:
        api_response = requests.get(api_url)
        api_data = api_response.json()
    except requests.exceptions.RequestException as e:
        return Response({"error": f"Failed to fetch data from API: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    enriched_data = []
    additional_fields = set()

    try:
        with open(csv_file_path, 'r') as csvfile:
            reader = csv.DictReader(csvfile)
            csv_data = list(reader)
            fieldnames = reader.fieldnames

        for row in csv_data:
            csv_value = str(row[csv_key])
            matching_api_data = next((item for item in api_data if str(item.get(api_key)) == csv_value), None)

            if matching_api_data:
                for key, value in matching_api_data.items():
                    if key != api_key:
                        row[key] = value
                        additional_fields.add(key)
            enriched_data.append(row)

    except Exception as e:
        return Response({"error": f"Error processing CSV file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    enriched_filename = f"enriched_{os.path.basename(csv_file_path)}"
    enriched_file_path = os.path.join(settings.MEDIA_ROOT, 'uploads', enriched_filename)

    try:
        with open(enriched_file_path, 'w', newline='') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames + list(additional_fields))
            writer.writeheader()
            writer.writerows(enriched_data)
    except Exception as e:
        return Response({"error": f"Failed to save enriched CSV file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    with open(enriched_file_path, 'rb') as f:
        enriched_csv = UploadedCSV.objects.create(file=File(f, name=enriched_filename), filename=enriched_filename)
        enriched_csv.save()

    return Response({
        "message": "CSV file enriched successfully",
        "file_id": enriched_csv.id,
        "filename": enriched_csv.filename
    }, status=status.HTTP_201_CREATED)
