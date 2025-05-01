from django.shortcuts import render
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Trip
from .serializers import TripSerializer
from user_app.views import TokenReq
 
# Jack : I removed the isAuthenticated stuff from your two views, and inherited TokenReq from the user_app.views file

class TripListCreateView(TokenReq):
    # list off all trips
    def get(self, request):
        trips = Trip.objects.filter(user=request.user)
        serializer = TripSerializer(trips, many=True)
        return Response(serializer.data)
    

    # create new trip
    def post(self,request):
        serializer = TripSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user= request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    # read, update, delete trips
class TripDetailView(TokenReq):
    # get trip for a user
    def get_object(self, pk, user):
        try:
            return Trip.objects.get(pk=pk, user=user)
        except Trip.DoesNotExist:
            return None
    # details for a single trip 
    def get(self, request, pk):
        trip= Trip.objects.get(id=pk)
        # trip = self.get_object(pk, request.user)
        if not trip:
            return Response({"error": "Trip not found"}, status=404)
        serializer = TripSerializer(trip)
        return Response(serializer.data)
    # update specific trip
    def put(self, request, pk):
        trip = self.get_object(pk, request.user)
        if not trip:
            return Response({"error": "Trip not found"}, status=404)
        serializer = TripSerializer(trip, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    # delete trip
    def delete(self, request, pk):
        trip = self.get_object(pk, request.user)
        if not trip:
            return Response({"error": "Trip not found"}, status=404)
        trip.delete()
        return Response(status=204)
    
# Create your views here.
