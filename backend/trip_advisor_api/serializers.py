from rest_framework.serializers import ModelSerializer
from .models import API


class API_Used_Serializer(ModelSerializer):

    class Meta:
        model = API
        fields = '__all__'
        read_only_fields = ['id']