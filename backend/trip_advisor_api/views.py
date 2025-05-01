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
