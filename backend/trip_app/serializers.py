from rest_framework import serializers
from .models import Trip

class TripSerializer(serializers.ModelSerializer):
    class meta:
        model = Trip
        fields = '__all__'