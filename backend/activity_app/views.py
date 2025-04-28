from rest_framework.views import Response, APIView # importing needed Response and APIView classes
from django.shortcuts import get_object_or_404
from rest_framework import status as s
from user_app.views import TokenReq
from .models import Activity
from .serializers import Activity_Serializer

class Activities(TokenReq):
  def get(self, request, itinerary_id):
    # NEED TO ADD ANOTHER CONSTRAINT TO THE FILTER TO ALLOW MATCHING ITINERARY_IDS to a Itinerary field
    itinerary_activities = Activity.objects.filter(user=request.user, itinerary=itinerary_id)
    serialized_activities = Activity_Serializer(itinerary_activities, many=True)
    return Response(serialized_activities.data, status=s.HTTP_200_OK)
  
  def post(self, request, itinerary_id):
    data = request.data.copy()
    print('data')
    return Response(True)

class Activity(TokenReq):
  def get(self, request, id):
    activity = get_object_or_404(Activity, id=id)
    serialized_activity = Activity_Serializer(activity)
    return Response(serialized_activity.data, status=s.HTTP_200_OK)
  
  def put(self, request, id):
    data = request.data.copy()

    # get the activity instance that is going to be edited
    activity_to_edit = get_object_or_404(Activity, id=id, user=request.user)
    # serialized it to validate the data
    serialized_activity = Activity_Serializer(activity_to_edit, data=data, partial=True)
    if serialized_activity.is_valid():
      serialized_activity.save() # save the updated instance if it's valid
      return Response(status=s.HTTP_200_OK)
    return Response(serialized_activity.errors, status=s.HTTP_400_BAD_REQUEST)
  



