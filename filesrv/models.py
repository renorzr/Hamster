from django.db import models

class Folder(models.Model):
    path=models.CharField(max_length=256)
    name=models.CharField(max_length=100)
