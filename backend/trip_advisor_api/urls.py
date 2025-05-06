
from django.urls import path
from .views import grabLocID, API_Usage, API_User

urlpatterns = [
  path('locID/', grabLocID.as_view(), name="locID"),
  path('apiUser/', API_User.as_view(), name='api-user'),
  path('apiUsed/<str:api_key>/',API_Usage.as_view(), name='api-useage'),
]

