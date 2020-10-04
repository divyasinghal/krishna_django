from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import layerinfo



class layerinfoForm(forms.ModelForm):
    admin_allowed = forms.BooleanField(initial=True, required=False)
    user_allowed= forms.BooleanField(initial=False, required=False)

    class Meta:
        model = layerinfo
        fields = "__all__"
