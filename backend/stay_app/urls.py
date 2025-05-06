from django.urls import path
from .views import A_Stay, All_Stays
urlpatterns = [
    path('itinerary/<int:trip_id>/', All_Stays.as_view(), name='all-stays'),
    path('<int:stay>/', A_Stay.as_view(), name='stay'),
]