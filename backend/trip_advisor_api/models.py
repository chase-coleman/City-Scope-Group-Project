from django.db import models

# Create your models here.

class API_Usage(models.Model):
    api_key = models.CharField()
    key_owner = models.CharField()
    key_Used = models.PositiveIntegerField(default=0)

    def __rpr__(self):
        return f"{self.key}, {self.key_used}"
    
    def str(self):
        return f"{self.key}, {self.key_used}"