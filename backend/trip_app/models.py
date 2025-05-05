from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class Trip(models.Model):
    name = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    country = models.CharField(max_length=255)
    duration = models.IntegerField()
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="trips")


    def __str__(self):
        return f"{self.name} - {self.city}, {self.country}"
# Create your models here.
