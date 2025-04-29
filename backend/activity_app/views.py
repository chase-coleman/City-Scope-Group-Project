from rest_framework.views import Response, APIView # importing needed Response and APIView classes
from django.shortcuts import get_object_or_404
from rest_framework import status as s
from user_app.views import TokenReq
from .models import Activity
from .serializers import Activity_Serializer
from itinerary_app.models import Itinerary

class Activities(TokenReq):
  def get(self, request, itinerary_id):
    # NEED TO ADD ANOTHER CONSTRAINT TO THE FILTER TO ALLOW MATCHING ITINERARY_IDS to a Itinerary field
    itinerary_activities = Activity.objects.filter(user=request.user, itineraries=itinerary_id)
    serialized_activities = Activity_Serializer(itinerary_activities, many=True)
    return Response(serialized_activities.data, status=s.HTTP_200_OK)
  
  def post(self, request, itinerary_id):
    data = request.data.copy()
    # set the itinerary_id to be associated with the actual itinerary instance
    itinerary = get_object_or_404(Itinerary, pk=itinerary_id)
    # create the model instance for new activity
    new_activity = Activity.objects.create(itineraries=itinerary, **data)
    serialized_activity = Activity_Serializer(new_activity)
    # check validity
    if serialized_activity.is_valid():
      serialized_activity.save() # save it to the database
      return Response(serialized_activity.data, status=s.HTTP_201_CREATED)
    return Response(serialized_activity.errors, status=s.HTTP_400_BAD_REQUEST)
  
