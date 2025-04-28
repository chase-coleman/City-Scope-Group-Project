from rest_framework import serializers

from .models import Itinerary

class Itinerary_Serializer(serializers.ModelSerializer):

  class Meta:
    model = Itinerary
    fields = "__all__"