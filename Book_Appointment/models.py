from django.db import models

class Appointment(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    date = models.DateField()
    slots = models.CharField(max_length=100)  

    def __str__(self):
        return f"{self.name} - {self.date} {self.slots}"