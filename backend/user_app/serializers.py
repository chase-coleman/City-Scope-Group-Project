from rest_framework.serializers import ModelSerializer
from .models import User

# Create Serializer to display User info 
class UserInfoSerializer(ModelSerializer):
  class Meta:
    model = User 
    # change field to what we want to display later
    fields = ['id', 'first_name', 'last_name', 'email', 'username']

class UserSignupSerializer(ModelSerializer):
  class Meta:
    model = User 
    fields = ['id', 'first_name', 'last_name', 'email', 'username', 'password']
    extra_kwargs = {
      'password': {'write_only': True}
    }

  def create(self, validated_data):
    password = validated_data.pop('password')
    user = User(**validated_data)
    user.set_password(password)
    user.save()
    return user
