from rest_framework import serializers

from .models import Itinerary

from stay_app.serializers import Stay_Serializer
from activity_app.serializers import Activity_Serializer

class Itinerary_Serializer(serializers.ModelSerializer):
  stays = Stay_Serializer(many=True)
  activities = Activity_Serializer(many=True)

  class Meta:
    model = Itinerary
    fields = "__all__"