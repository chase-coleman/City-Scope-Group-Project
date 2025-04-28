from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework import serializers
from .models import Activity

class ActivitySerializer(ModelSerializer):
  class Meta: 
    model = Activity
    fields = ['id', 'name', 'location', 'address', 'url']