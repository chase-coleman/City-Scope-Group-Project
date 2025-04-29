from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Trip
from .serializers import TripSerializer

#  CRUD for trips
class TripListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    # list off all trips
    def get(self, request):
        trips = Trip.objects.filter(user=request.user)
        serializer = TripSerializer
        return Response(serializer.data)
    

    # create new trip
    def post(self,request):
        serializers = TripSerializer(data=request.data)
# Create your views here.
