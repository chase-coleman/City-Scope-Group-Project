from django.db import models

from trip_app.models import Trip
from stay_app.models import Stay

class Itinerary(models.Model):
  date = models.DateField()
  stay = models.ForeignKey(Stay, on_delete=models.SET_NULL, null=True, blank=True, related_name="stay", default=None)
  trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="itinerary")

  def __str__(self):
    return f"{self.id}. Itinerary for date: {self.date}"
  
  def change_date(self, new_date):
   self.date = new_date
   self.save() 