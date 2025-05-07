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
HTTP_226_IM_USED,\
HTTP_403_FORBIDDEN
from .utility import get_locID
from .models import API
from .serializers import API_Used_Serializer


# https://api.content.tripadvisor.com/api/v1/location/search?key=FCA3795BF57C4B3F8564DDA975F319D4&searchQuery=tokyo%2C%20japan&category=hotels&language=en
class grabLocID(APIView):
    def get(self, request):
        searchQuery = request.query_params.get("searchQuery")
        category = request.query_params.get("category")
        key = request.query_params.get("akey")
        results = request.query_params.get("results")
        address = request.query_params.get("address")
        latlong = request.query_params.get("latlong")
        
        if not (searchQuery and key):
            return Response({"error": "Missing query parameters: searchQuery, category, and key"}, status=HTTP_400_BAD_REQUEST)
        parameters = {}
        if address:
            parameters['address'] = address
        if latlong:
            parameters['latlong'] = latlong
        
        loc_data = get_locID(searchQuery, category, key, results, address, latlong)
        

        # print(loc_data)
        print(f"{searchQuery} {category} {key} fail getting loc_data")
        if isinstance(loc_data, dict) and 'error' in loc_data:
            return Response({
                "error": loc_data['error']
            }, status=HTTP_400_BAD_REQUEST
            )
        if loc_data:
            print(f"{searchQuery} {category} {key} success")

            return Response({
                "locinfo":loc_data
            }, status=HTTP_200_OK
            )
        return Response({
            "error":"Failed to fetch location information"
        }, status=HTTP_400_BAD_REQUEST
        )


class API_Usage(APIView):
    def get(self, request, api_key):
        apis = API.objects.filter(api_key = api_key)
        serialized = API_Used_Serializer(instance=apis, many=True)
        if not apis.exists():
            return Response({"error": "No API usage found for the provided key"}, status=HTTP_400_BAD_REQUEST)
        return Response({"APIs":serialized.data}, status=HTTP_200_OK)
    
    def put(self, request, api_key):
        apis = API.objects.filter(api_key = api_key)[0]
        print(apis.key_used)
        apis.key_used += 1
        apis.save()
        return Response({
            "key_useage":apis.key_used
            }, status=HTTP_200_OK)
                
class API_User(APIView):
    def post(self, request):
        data = request.data.copy()
        api_key = data['api_key']
        key_owner = data['key_owner']
        key_used = data['key_used']
        newAPI = {
            "api_key": api_key,
            "key_owner": key_owner,
            "key_used": key_used
        }
        serialized = API_Used_Serializer(data = newAPI)
        if serialized.is_valid():
            serialized.save()
            return Response({
                "new_api_key": serialized.data
            }, status=HTTP_201_CREATED)
        return Response({
            "error":"Error creating new API Key"
        })
    



