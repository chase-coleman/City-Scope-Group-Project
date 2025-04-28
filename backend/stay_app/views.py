from django.shortcuts import render, get_object_or_404
from user_app.views import TokenReq
from user_app.models import User
from rest_framework.response import Response
from .models import Stay
from .serializers import Stay_Serializer
from itinerary_app.models import Itinerary
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_204_NO_CONTENT,
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_500_INTERNAL_SERVER_ERROR,
)


class All_Stays(TokenReq):

#
# ---------------------
# |     GET ALL       |
# ---------------------
#

    def get(Self, request, ininerary):
        try:
            stays = Stay.objects.get(User=request.user, Ininerary = ininerary)
            serialized_stays = Stay_Serializer(stays, many=True)
            return Response({"stays": serialized_stays.data}, status=HTTP_200_OK)
        except:
            return Response(
                "User has no itenerary or itenerary belongs to another user or trip",
                status=HTTP_400_BAD_REQUEST,
            )

#
# ---------------------
# |       POST        |
# ---------------------
#

    def post(self, request, ininerary):
        data = request.data.copy()
        data["ininerary"] = ininerary
        serialized_stay = Stay_Serializer(data=data)
        if serialized_stay.is_valid():
            instance = serialized_stay.save()
            instance.refresh_from_db()
            return Response(
                {"stay": Stay_Serializer(instance).data}, status=HTTP_201_CREATED
            )
        return Response(Stay_Serializer.error, status=HTTP_400_BAD_REQUEST)

class A_Stay(TokenReq):

    def get(self, request, stay):
        try:
            grab_stay = get_object_or_404(request.user.trip.ininerary, id = stay)
        except:
            return Response("invalid stay or it belongs to another user")    
        if grab_stay:
            return Response(
                Stay_Serializer(stay).data, status=HTTP_200_OK
            )
        return Response("Invalid Stay or stay belongs to another user")
    
    def put(self, request, stay):
        data = request.data.copy()
        try:
            stay = get_object_or_404(request.user.trip.ininerary.stay)
        except:
            return Response("Invalid Stay or the stay belongs to another user")
        if data['name']:
            stay.name = data['name']
        if data['location']:
            stay.location = data['location']
        if data['duration']:
            stay.duration = data['duration']
        if data['link']:
            stay.link = data['link']
        serialized_stay = Stay_Serializer(stay)
        if serialized_stay.is_valid():
            serialized_stay.save()
            return Response("Stay has been updated", status=HTTP_200_OK)
        return Response("The provided parameters were invalid and the stay was not updated")