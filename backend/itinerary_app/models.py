from django.db import models

# from stay_app.models import Stay
# from activity_app.models import Activity

# Create your models here.

class Itinerary(models.Model):
  date = models.DateField()

  # stays = models.ForeignKey(Stay, on_delete=models.CASCADE, related_name="itinerary")
  # activities = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name="itinerary")