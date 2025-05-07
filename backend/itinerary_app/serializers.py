from rest_framework import serializers

from .models import Itinerary

from activity_app.serializers import Activity_Serializer
from stay_app.serializers import Stay_Serializer
from trip_app.serializers import TripSerializer

class Itinerary_Serializer(serializers.ModelSerializer):
  stay = Stay_Serializer(allow_null=True, required=False)
  activities = Activity_Serializer(many=True, allow_null=True, required=False)
  trip = TripSerializer()

  class Meta:
    model = Itinerary
    fields = "__all__"
