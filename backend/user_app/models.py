from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
  email = models.EmailField(unique=True, max_length=100)
  REQUIRED_FIELDS = ['email'] # requiring email to have input

  def __str__(self):
    return f"{self.id}. {self.username}"
