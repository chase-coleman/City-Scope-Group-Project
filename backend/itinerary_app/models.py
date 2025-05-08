from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError

from django.db import models

from trip_app.models import Trip
from stay_app.models import Stay

class Itinerary(models.Model):
  date = models.DateField()
  stay = models.ForeignKey(Stay, on_delete=models.SET_NULL, null=True, blank=True, related_name="stay", default=None)
  trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="itinerary")
  activities = ArrayField(
    base_field=models.IntegerField(),
    size=21,
    default=list,
    blank=True
  )

  def __str__(self):
    return f"{self.id}. Itinerary for date: {self.date}"
  
  def update_activities(self, new_activity_array):
    if len(new_activity_array) > 21:
      raise ValidationError("Cannot have more than 21 activities per itinerary")
    self.activities = new_activity_array
    self.save()
  
  def change_date(self, new_date):
   self.date = new_date
   self.save() 