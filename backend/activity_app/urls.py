from django.urls import path
from .views import Activities

urlpatterns = [
  path('all/<int:trip_id>', Activities.as_view(), name="activities"),
#   path('<int:id>/', Activity.as_view(), name="activity"),
]