from django.urls import path
from .views import Activities

urlpatterns = [
  path('all/<int:itinerary_id>/', Activities.as_view(), name="activities"),
]
#   path('<int:id>/', Activity.as_view(), name="activity"),