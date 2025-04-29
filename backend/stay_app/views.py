from django.shortcuts import render, get_object_or_404
from user_app.views import TokenReq
from user_app.models import User
from rest_framework.response import Response
from .models import Stay
from .serializers import Stay_Serializer
from rest_framework.views import APIView
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

    def get(self, request, itinerary):
        try:

            stays = Stay.objects.filter(itinerary=itinerary)
            serialized_stays = Stay_Serializer(stays, many=True).data
            return Response({"stays": serialized_stays}, status=HTTP_200_OK)
        except:
            return Response(
                "User has no itinerary or itinerary belongs to another user or trip",
                status=HTTP_400_BAD_REQUEST,
            )


#
# ---------------------
# |       POST        |
# ---------------------
#

    def post(self, request, itinerary):
        data = request.data.copy()
        data["itinerary"] = itinerary
        serialized_stay = Stay_Serializer(data=data)
        if serialized_stay.is_valid():
            instance = serialized_stay.save()
            instance.refresh_from_db()
            return Response(
                {"stay": Stay_Serializer(instance).data}
                ,status=HTTP_201_CREATED
            )
        return Response(serialized_stay.errors, status=HTTP_400_BAD_REQUEST)

class A_Stay(TokenReq):
    def get(self, request, stay):
        try:
            grab_stay = Stay.objects.get(id=stay)
            serialized_stay = Stay_Serializer(grab_stay).data
        except:
            return Response("invalid stay")
        if serialized_stay:
            return Response(
                serialized_stay, status=HTTP_200_OK
            )
    
    def put(self, request, stay):
        data = request.data.copy()
        try:
            grab_stay = Stay.objects.get(id=stay)
        except:
            return Response("01: Invalid Stay or the stay belongs to another user")
        serialized_stay = Stay_Serializer(grab_stay, data=data, partial=True)
        if serialized_stay.is_valid():
            serialized_stay.save()
            return Response("Stay has been updated", status=HTTP_200_OK)
        return Response("The provided parameters were invalid and the stay was not updated")
    
    def delete(self, request, stay):
        try:
            to_delete = get_object_or_404(Stay, id = stay)
        except:
            return Response("That stay didn't exist", status = HTTP_400_BAD_REQUEST)
        if to_delete:
            to_delete.delete()
            return Response("The stay was deleted", status=HTTP_200_OK)