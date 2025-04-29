from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework import serializers
from .models import Activity

class Activity_Serializer(ModelSerializer):
  class Meta: 
    model = Activity
    fields = ['id', 'name', 'location', 'address', 'url', 'itineraries']