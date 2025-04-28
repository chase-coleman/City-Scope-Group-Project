from django.urls import path
from .views import Itinerary_View

urlpatterns = [
    path('<int:id>/', Itinerary_View.as_view(), name='itinerary_view')
]


