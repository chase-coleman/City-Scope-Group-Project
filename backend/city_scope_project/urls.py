from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/user/', include('user_app.urls')), # directs Django to the user_app.urls file
    path('api/v1/itinerary/', include('itinerary_app.urls')),
    path('api/v1/stay/', include('stay_app.urls')),
<<<<<<< HEAD
=======
    path('api/v1/trip/', include('trip_app.urls')),
>>>>>>> e4638c44c47ef1de2d304ac02ec1c207916853f4
    path('api/v1/activity/', include('activity_app.urls')), # directs django to the activity_app.urls
]
