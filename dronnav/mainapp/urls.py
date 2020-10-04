from django.contrib import admin
from django.urls import path,re_path
from . import views as mainappView


urlpatterns = [
   
    path('', mainappView.main, name='homepage'),
    path('addLayer', mainappView.addlayer, name='addlayer'),
    path('editfeat', mainappView.editfeat, name='editfeat')

]