from rest_framework import serializers

from .models import Itinerary

from stay_app.serializers import Stay_Serializer
from activity_app.serializers import Activity_Serializer

class Itinerary_Serializer(serializers.ModelSerializer):
  stay = Stay_Serializer(allow_null=True, required=False)
  activities = Activity_Serializer(many=True, allow_null=True, required=False)

  class Meta:
    model = Itinerary
    fields = "__all__"