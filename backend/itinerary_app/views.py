from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status as s

from django.shortcuts import get_object_or_404

from .models import Itinerary
from .serializers import Itinerary_Serializer

from trip_app.models import Trip

# Singular Itinerary viewer
# Requires an id for _RUD purposes
# Create will not need an ID and will be set automatically to None
class Itinerary_View(APIView):

  def get(self, request, id):
    try:
      itinerary = get_object_or_404(Itinerary, id=id, trip__user=request.user)
      itinerary_ser = Itinerary_Serializer(itinerary).data
      return Response(itinerary_ser, status=s.HTTP_201_CREATED)
    except:
      return Response(f"Failed to fetch itinerary of ID: {id}", status=s.HTTP_404_NOT_FOUND)

  def post(self, request, id=None):
    try:
      # The date the user inputs from the frontend in format YYYY-MM-DD
      date = request.data.get("date")
      trip_id = request.data.get("trip_id")
      trip = get_object_or_404(Trip, id=trip_id)
      itinerary = Itinerary.objects.create(date=date, trip=trip)
      itinerary_ser = Itinerary_Serializer(itinerary).data
      return Response(itinerary_ser, status=s.HTTP_200_OK)
    except:
      return Response(f"Failed to create an itinerary for the date: {date}", status=s.HTTP_400_BAD_REQUEST)
  
  def put(self, request, id):
    # id is the itinerary id
    itinerary = get_object_or_404(Itinerary, id=id, trip__user=request.user)
    payload = request.data
    try:
      if(payload.get("type") == "stay"):
        # Can also be null for removing stay from itinerary
        new_stay_id = payload.get("new_stay_id")
        itinerary.stay_id = new_stay_id
        itinerary.save()
        return Response(f"Saved new stay to itinierary", status=s.HTTP_200_OK)
    except:
      return Response(f"Failed to change stay ID", status=s.HTTP_400_BAD_REQUEST)
    
    try:
      if(payload.get("type") == "activities"):
        new_activity_array = payload.get("new_activity_array")
        print(new_activity_array)
        itinerary.update_activities(new_activity_array)
        return Response(f"Sucessfully updated itinerary array", status=s.HTTP_200_OK)
    except:
      return Response(f"Failed to update activities in PUT method", status=s.HTTP_400_BAD_REQUEST)
  
    try:
      new_date = request.data.get("date")
      itinerary.change_date(new_date)
      return Response(f"Date changed to {new_date}", status=s.HTTP_200_OK)
    except:
      return Response(f"Failed to change date", status=s.HTTP_400_BAD_REQUEST)
      

  def delete(self, request, id):
    try:
      itinerary = get_object_or_404(Itinerary, id=id, trip__user=request.user)
      if Itinerary.objects.count() <= 1:
        return Response(f"Cannot delete last itinerary. Must keep the first day", status=s.HTTP_403_FORBIDDEN)
      itinerary.delete()
      return Response(f"Itinerary of ID: {id} deleted succesfully", status=s.HTTP_204_NO_CONTENT)
    except: 
      return Response(f"Failed to delete itinerary of ID: {id}", status=s.HTTP_400_BAD_REQUEST)



# Get all Itineries pertaining to a a trip
class Itinerary_View_All(APIView):
  def get(self, request, trip_id):
    try:
      itineraries = Itinerary.objects.filter(trip=trip_id, trip__user=request.user).all()
      print(itineraries)
      if not itineraries:
        return Response("No Itineraries found", status=s.HTTP_418_IM_A_TEAPOT)
      itineraries_ser = Itinerary_Serializer(itineraries, many=True).data
      return Response(itineraries_ser, status=s.HTTP_200_OK)
    except:
      return Response(f"Failed to retrieve all Itineraries pertaining to trip ID: {trip_id}", status=s.HTTP_404_NOT_FOUND)