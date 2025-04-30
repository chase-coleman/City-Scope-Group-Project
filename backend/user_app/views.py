from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import login, logout, authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status as s
from .models import User
from django.shortcuts import get_object_or_404
from .serializers import UserInfoSerializer

# TO DO : add a 'trips' key/value pair inside the user_info dict being created in the User view + serializer for trips

# any view inheriting this class is ensuring only logged in (authenticated) users can access it
class TokenReq(APIView):
  authentication_classes = [TokenAuthentication]
  permission_classes = [IsAuthenticated]

# User Class Views
class User_View(TokenReq):
  def get(self, request):
    current_user = request.user
    # creating object to return to request origin
    user_info = {
      'id': current_user.id,
      "first_name": current_user.first_name,
      "last_name": current_user.last_name,
      "email": current_user.email,
      "username": current_user.username
    }
    # serialize the info to return to frontend
    serialized_user = UserInfoSerializer(user_info)
    return Response(serialized_user.data, status=s.HTTP_200_OK)
  
  def put(self, request):
    data = request.data.copy()
    # pass the request's data into the serializer
    serialized = UserInfoSerializer(request.user, data=data, partial=True)
    if serialized.is_valid():
      serialized.save() # if the data is valid, save it to the db
      return Response({"message": "Info was successfully updated!"}, status=s.HTTP_200_OK)
    return Response(serialized.errors, status=s.HTTP_400_BAD_REQUEST)
  
class SignUp(APIView):
  def post(self, request):
    data = request.data.copy()
    # if user provided no username, their provided email is set as the username
    data['username'] = request.data.get("username", request.data.get("email"))
    
    is_superuser = data.get('is_superuser', False)

    serialized_data = UserInfoSerializer(data=data)
    if serialized_data.is_valid():
      # creating a new user instance with the valid data
      new_user = serialized_data.save()
    
      if is_superuser:
        new_user.is_superuser = True
        new_user.is_staff = True
        new_user.save()

      token = Token.objects.create(user=new_user)
      return Response({"message": "Account successfully created", "token": token.key}, status=s.HTTP_201_CREATED)
    return Response(serialized_data.errors, status=s.HTTP_400_BAD_REQUEST)
  

class Login(APIView):
  def post(self, request):
    data = request.data.copy()
    # reading the request data's username/email field
    username = data.get("username") or data.get("email")
    password = data.get("password")

    if not username or not password:
      return Response ({"error": "username/email and password are required."}, status=s.HTTP_400_BAD_REQUEST)

    # authenticate their provided username/password with their username/password in the server
    current_user = authenticate(username=username, password=password)

    if current_user:
      login(request, current_user) # log them in 
      # get their token credentials or create one for them 
      token, create = Token.objects.get_or_create(user = current_user)
      return Response({"token":token.key}, status=s.HTTP_200_OK)
    
    return Response(f"Username or password incorrect", status=s.HTTP_400_BAD_REQUEST)

class Logout(TokenReq):
  def post(self, request):
    # delete the user's auth token if it exists
    if hasattr(request.user, "auth_token"):
      request.user.auth_token.delete()
      logout(request)
      return Response({"message":"user has been logged out"}, status=s.HTTP_200_OK)
  
class DeleteAccount(TokenReq):
  def delete(self, request):
      # delete the user's auth token if it exists before logging them out
      if hasattr(request.user, "auth_token"):
        request.user.auth_token.delete()
      logout(request)
      # delete the user from the database
      request.user.delete()
      return Response(status=s.HTTP_204_NO_CONTENT)