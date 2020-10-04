from django.db import models

# Create your models here.
class layerinfo(models.Model):
    layertype = (
    ("raster", "Raster Layer"),
    ("vector", "Vector Layer")
    )
    display_name = models.CharField(max_length=50, unique=True)
    geoserver_layer_name = models.CharField(max_length=50, unique=True)
    store_layer_name = models.CharField(max_length=50)
    db_layer_name = models.CharField(max_length=50)
    layer_type =  models.CharField(max_length=50,choices=layertype)
    style_name= models.CharField(max_length=50, blank=True, null=True)
    admin_allowed = models.BooleanField(default=True,blank=True, null=True) 
    user_allowed = models.BooleanField(default=False,blank=True, null=True)

    def __str__(self):
        return self.display_name
