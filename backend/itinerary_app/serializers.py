from rest_framework import serializers

from .models import Itinerary
from activity_app.models import Activity

from activity_app.serializers import Activity_Serializer
from stay_app.serializers import Stay_Serializer
from trip_app.serializers import TripSerializer

class Itinerary_Serializer(serializers.ModelSerializer):
  stay = Stay_Serializer(allow_null=True, required=False)
  trip = TripSerializer()
  activities = serializers.SerializerMethodField()

  class Meta:
    model = Itinerary
    fields = "__all__"

  def get_activities(self, obj):
    if not obj.activities:
        return []
    # Load all relevant activities into a dict {id: activity_instance}
    activity_map = Activity.objects.in_bulk(obj.activities)
    # Preserve order and duplicates by creating a new surrounding array and going id by id in place
    activities = [activity_map.get(id) for id in obj.activities if activity_map.get(id)]
    return Activity_Serializer(activities, many=True).data