
from django.urls import path
from .views import grabLocID, API_Usage

urlpatterns = [
  path('locID/', grabLocID.as_view(), name="locID"),
  path('apiUsed/',API_Usage.as_view(), name='api-useage'),
]