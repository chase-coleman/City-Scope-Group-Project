from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from itinerary_app.models import Itinerary
from .models import Stay

class Stay_Serializer(ModelSerializer):
    # itinerary = PrimaryKeyRelatedField(queryset=Itinerary.objects.all())

    class Meta:
        model = Stay
        fields = '__all__'
        read_only_fields = ['id']