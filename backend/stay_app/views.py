from django.shortcuts import render
from user_app.views import TokenReq
from user_app.models import User
from rest_framework.response import Response
from models import Stay
from serializers import Stay_Serializer
from itinerary_app import Itinerary
from rest_framework.status import \
HTTP_200_OK,\
HTTP_201_CREATED,\
HTTP_204_NO_CONTENT,\
HTTP_400_BAD_REQUEST,\
HTTP_404_NOT_FOUND,\
HTTP_500_INTERNAL_SERVER_ERROR

class All_Stays(TokenReq):

# 
# ---------------------
# |     GET ALL       |
# ---------------------
# 
    def get(Self, request):
        try:
            stays = Stay.objects.get(User = request.user)
            serialized_stays = Stay_Serializer(stays, many=True)
            return Response({
                'stays': serialized_stays.data
            },
            status = HTTP_200_OK
            )
        except:
            return Response("User has no itenerary or itenerary belongs to another user or trip", status=HTTP_400_BAD_REQUEST)
        
