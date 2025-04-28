from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/user/', include('user_app.urls')), # directs Django to the user_app.urls file
    path('api/v1/itinerary', include('itinerary_app.urls')),
]
