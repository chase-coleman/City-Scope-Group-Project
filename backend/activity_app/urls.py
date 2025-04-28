from django.urls import path
from .views import Activities, Activity

urlpatterns = [
  path('all/<int:itinerary_id>', Activities.as_view(), name="activites"),
  path('<int:id>/', Activity.as_view(), name="activity"),
]