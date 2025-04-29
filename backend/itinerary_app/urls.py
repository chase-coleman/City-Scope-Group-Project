from django.urls import path
from .views import Itinerary_View, Itinerary_View_All

urlpatterns = [
    path('', Itinerary_View.as_view(), name='itinerary_view'),
    path('<int:id>/', Itinerary_View.as_view(), name='itinerary_view'),
    path('all/<int:trip_id>/', Itinerary_View_All.as_view(), name="all_itinerary_view_per_trip"),
]


