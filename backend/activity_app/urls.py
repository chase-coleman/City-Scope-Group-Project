from django.urls import path
from .views import Activities, Single_Activity

urlpatterns = [
  path('all/<int:trip_id>/', Activities.as_view(), name="activities"),
  path('<int:id>/', Single_Activity.as_view(), name="activity"),
]