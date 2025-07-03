from django.urls import path
from .views import api_home
from .views import check

urlpatterns = [
    path('', api_home, name="api-home"),
    path('check/', check, name = "dummy-check")
]