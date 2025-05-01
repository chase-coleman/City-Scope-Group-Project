
from django.urls import path
from .views import grabLocID#, grabDetails

urlpatterns = [
  path('locID/', grabLocID.as_view(), name="locID"),
]