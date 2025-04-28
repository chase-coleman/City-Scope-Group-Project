from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField
from models import Stay, Itinerary

class Stay_Serializer(ModelSerializer):
    Itineraries = PrimaryKeyRelatedField(queryset=Itinerary.objects.all())

    class Meta:
        model = Stay
        fields = '__all__'
        read_only_fields = ['id']
