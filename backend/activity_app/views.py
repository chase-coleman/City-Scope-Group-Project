from rest_framework.views import Response, APIView # importing needed Response and APIView classes
from django.shortcuts import get_object_or_404
from rest_framework import status as s
from user_app.views import TokenReq
from .models import Activity
from .serializers import Activity_Serializer

class Activities(TokenReq):
  def get(self, request, itinerary_id=None):
    # NEED TO ADD ANOTHER CONSTRAINT TO THE FILTER TO ALLOW MATCHING ITINERARY_IDS to a Itinerary field
    itinerary_activities = Activity.objects.filter(user=request.user)
    serialized_activities = Activity_Serializer(itinerary_activities, many=True)
    return Response(serialized_activities.data, status=s.HTTP_200_OK)
  
