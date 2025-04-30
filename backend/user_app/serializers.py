from rest_framework.serializers import ModelSerializer
from .models import User

# Create Serializer to display User info 
class UserInfoSerializer(ModelSerializer):
  class Meta:
    model = User 
    # change field to what we want to display later
    fields = ['id', 'first_name', 'last_name', 'email', 'username']
  
