from django.db import models
from django.core import validators as v
from trip_app.models import Trip

class Stay(models.Model):
    name = models.CharField(max_length = 120, blank=False, null = False, default='name')
    location = models.CharField(max_length= 120, blank=False, null=False, default='location')
    duration = models.PositiveIntegerField(blank=False, null=False, default=3)
    link = models.CharField(max_length=255, null=True, blank=True, default = "")
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name='stay')
    image_thumb = models.CharField(null = True, blank=True)
    image_main = models.CharField(null = True, blank=True)
    location_id = models.CharField(null = True, blank=True)

    def __rpr__(self):
        return f"{self.name}, {self.duration} days in {self.location}"
    
    def str(self):
        return f"{self.name}, {self.duration} days in {self.location}"
    
    def change_stay_name(self, name):
        self.set_name = name
        self.save()
    
    def change_location(self, location):
        self.location = location
        self.save()

    def change_link(self, link):
        self.link = link
        self.save()