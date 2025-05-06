from django.core.validators import MinValueValidator, MaxValueValidator
from django.db import models
from itinerary_app.models import Itinerary
from trip_app.models import Trip


class Activity(models.Model):
  name = models.CharField(max_length=50, null=False, blank=False)
  location = models.CharField(max_length=100, null=True, blank=True)
  address = models.CharField(max_length=100, null=True, blank=True)
  url = models.URLField(null=True, blank=True)
  itineraries = models.ForeignKey(Itinerary, on_delete=models.CASCADE, related_name="activities", null=True, blank=True)
  trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="activities")
  image_thumb = models.CharField(null=True, blank=True)
  image_main = models.CharField(null=True, blank=True)
  location_id = models.CharField(null=True, blank=True)
  category = models.CharField(null=True, blank=True)

  def __str__(self):
    return f"Activity ID: {self.id}, Name: {self.name}, url: {self.url}"
  
