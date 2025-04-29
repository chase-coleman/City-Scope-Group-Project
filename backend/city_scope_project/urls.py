from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/user/', include('user_app.urls')), # directs Django to the user_app.urls file
    path('api/v1/itinerary/', include('itinerary_app.urls')),
    path('api/v1/stay/', include('stay_app.urls')),
<<<<<<< HEAD
    path('api/v1/trip/', include('trip_app.urls')),

    # path('api/v1/activity/', include('activity_app.urls')), # directs django to the activity_app.urls
=======
    path('api/v1/activity/', include('activity_app.urls')), # directs django to the activity_app.urls
>>>>>>> 26ca7f635b039d86f23779c1db988591944137b8
]
