from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from .models import Stay

class Stay_Serializer(ModelSerializer):

    class Meta:
        model = Stay
        fields = '__all__'
        read_only_fields = ['id']