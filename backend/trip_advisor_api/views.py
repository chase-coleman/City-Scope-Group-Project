from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files import File
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from rest_framework.status import \
HTTP_200_OK,\
HTTP_201_CREATED,\
HTTP_204_NO_CONTENT,\
HTTP_400_BAD_REQUEST,\
HTTP_404_NOT_FOUND,\
HTTP_500_INTERNAL_SERVER_ERROR,\
HTTP_226_IM_USED
from .utility import get_locID
from .models import API_Usage
from .serializers import API_Used_Serializer


# https://api.content.tripadvisor.com/api/v1/location/search?key=FCA3795BF57C4B3F8564DDA975F319D4&searchQuery=tokyo%2C%20japan&category=hotels&language=en
class grabLocID(APIView):
    def get(self, request):
        city = request.query_params.get("city")
        country = request.query_params.get("country")
        category = request.query_params.get("category")
        if not (city and country and category):
            return Response({"error": "Missing query parameters"}, status=HTTP_400_BAD_REQUEST)
        locID = get_locID(city, country, category)
        if locID:
            return Response({"locinfo": locID}, status=HTTP_200_OK)
        return Response({"error": "Failed to fetch data"}, status=HTTP_400_BAD_REQUEST)


class API_Usage(APIView):
    def get(self, request):
        apis = API_Usage.objects.all()
        serialized = API_Used_Serializer(apis, many=True)
        if serialized.is_valid():
            return Response({
                "APIs":serialized.data
            },
            status=HTTP_200_OK
            )
        return Response({
            "error":"There was an error grabbing the useage data"
        })
    
    def post(self, request):
        data = request.data.copy()
        api_key = data['api_key']
        key_owner = data['key_owner']
        key_used = data['key_Used']
        newAPI = {
            "api_key": api_key,
            "key_owner": key_owner,
            "key_used": key_used
        }
        serialized = API_Used_Serializer(data = newAPI)
        if serialized.is_Valid():
            serialized.save()
            return Response({
                "new_api_key": serialized.data
            }, status=HTTP_201_CREATED)
        return Response({
            "error":"Error creating new API Key"
        })
    
    def put(self, request):
        data = request.data.copy()
        owner = data['key_owner']
        key = get_object_or_404(API_Usage, key_owner = owner)
        key.key_used += 7
        serialized = API_Used_Serializer(key.data)
        if serialized.is_valid():
            serialized.save()
            return Response({
                "key_useage":serialized
            }, status=HTTP_200_OK)
        return Response({
            "error":"There was an error updating the key useage"
        })


