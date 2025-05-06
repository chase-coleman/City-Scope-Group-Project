from rest_framework.serializers import ModelSerializer
from .models import API_Usage


class API_Used_Serializer(ModelSerializer):

    class Meta:
        model = API_Usage
        fields = '__all__'
        read_only_fields = ['id']