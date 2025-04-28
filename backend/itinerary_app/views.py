from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status as s

from django.shortcuts import get_object_or_404

from .models import Itinerary
from .serializers import Itinerary_Serializer

# Singular Itinerary viewer
# Requires an id for _RUD purposes
# Create will not need an ID and will be set automatically to None
class Itinerary_View(APIView):

  def get(self, request, id):
    try:
      user_itinerary = get_object_or_404(Itinerary, id=id)
      user_itinerary_ser = Itinerary_Serializer(user_itinerary).data
      return Response(user_itinerary_ser, status=s.HTTP_200_OK)
    except:
      return Response(f"Failed to fetch itinerary of ID: {id}", status=s.HTTP_404_NOT_FOUND)

  def post(self, request, id=None):
    try:
      # The date the user inputs from the frontend in format YYYY-MM-DD
      date = request.data.date
      Itinerary.objects.create(date=date)
      return Response(f"Itinerary created for the date: {date}")
    except:
      return Response(f"Failed to create an itinerary for the date: {date}")



# Get all Itineries pertaining to a a trip
class Itinerary_View_All(APIView):
  def get(self, request, trip_id):
    try:
      users_itineraries = Itinerary.objects.filter(trip = trip_id).all()

    except:
      return Response(f"Failed to retrieve all Itineraries pertaining to trip ID: {trip_id}")