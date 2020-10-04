from django.shortcuts import render,redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, authenticate
from .forms import layerinfoForm
from .models import layerinfo
from django.db import connection, connections, transaction
from django.http import JsonResponse, HttpResponse


# Create your views here.
@login_required
def main(request):
    user = request.user
    # alllayers = layerinfo.objects.all()
    if user.is_superuser:
        alllayers = layerinfo.objects.filter(admin_allowed = True)
    else:
        alllayers = layerinfo.objects.filter(user_allowed = True)
    return render(request, 'mainapp/index.html',{"user":user,"alllayers":alllayers})


def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('homepage')
    else:
        form = UserCreationForm()
    return render(request, 'auth/signup.html', {'form': form})

@login_required
def addlayer(request):
    if request.method == 'POST':
        form = layerinfoForm(request.POST)
        if form.is_valid():
            form.save()
            form = layerinfoForm()
    else:
        form = layerinfoForm()
    return render(request, 'mainapp/addlayer.html', {'form': form})

@login_required
def editfeat(request):
    setParam = request.GET.get("sqlParam", None)
    print('got req - ', setParam)
    if setParam:
        cursor = connection.cursor()
        print('executed')
        cursor.execute(setParam)
    else:
        print('not executed')
        return HttpResponse("no setParam")

    return redirect("homepage")