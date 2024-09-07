from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import UploadedCSV
from .serializers import UploadedCSVSerializer
import csv


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
        return Response({'data': data})
    except UploadedCSV.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def list_csv_files(request):
    files = UploadedCSV.objects.all()
    serializer = UploadedCSVSerializer(files, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def preview_csv(request, file_id):
    try:
        uploaded_csv = UploadedCSV.objects.get(id=file_id)
        with open(uploaded_csv.file.path, 'r') as file:
            reader = csv.reader(file)
            data = list(reader)
        return Response({'data': data})
    except UploadedCSV.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
