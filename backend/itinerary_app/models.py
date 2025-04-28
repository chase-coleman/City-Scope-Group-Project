from django.db import models

# from trip_app.models import Trip

class Itinerary(models.Model):
  date = models.DateField()
  # trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="itinerary")