from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BarberViewSet, AppointmentViewSet, ReviewViewSet

router = DefaultRouter()
router.register(r'barbers', BarberViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/', include('dj_rest_auth.urls')),
]