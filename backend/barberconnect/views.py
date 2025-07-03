from django.db.models import Count, Avg
from rest_framework.decorators import action
from rest_framework.viewsets import ModelViewSet
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import Distance
from django.contrib.auth import get_user_model
from .models import Barber, Appointment, Review
from .serializers import (
    UserSerializer, BarberSerializer, 
    AppointmentSerializer, ReviewSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            
            if request.data.get('user_type') == User.BARBER:
                Barber.objects.create(
                    user=user,
                    shop_name=request.data.get('shop_name'),
                    address=request.data.get('address'),
                    services=request.data.get('services', []),
                    availability=request.data.get('availability', {})
                )
            
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'user_type': user.user_type
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BarberList(generics.ListAPIView):
    serializer_class = BarberSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Barber.objects.all()
        
        # Location-based filtering
        lat = self.request.query_params.get('lat')
        lng = self.request.query_params.get('lng')
        if lat and lng:
            user_location = Point(float(lng), float(lat), srid=4326)
            queryset = queryset.filter(
                location__distance_lte=(user_location, Distance(km=10))
        
        # Search by name or service
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(shop_name__icontains=search) |
                models.Q(services__contains=[{'name': search}])
            )
        
        return queryset

class AppointmentCreate(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

class BarberAppointments(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Appointment.objects.filter(
            barber=self.request.user.barber
        ).order_by('date', 'time')

class AppointmentAction(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        action = request.data.get('action')
        
        if action == 'accept' and instance.status == Appointment.PENDING:
            instance.status = Appointment.CONFIRMED
            instance.save()
            # Send notification to customer
            return Response({'status': 'confirmed'})
        elif action == 'reject' and instance.status == Appointment.PENDING:
            instance.status = Appointment.REJECTED
            instance.save()
            # Send notification to customer
            return Response({'status': 'rejected'})
        return Response({'error': 'Invalid action'}, status=400)

class BarberViewSet(ModelViewSet):
    queryset = Barber.objects.all()
    serializer_class = BarberSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        if not request.user.is_authenticated or not hasattr(request.user, 'barber'):
            return Response({'error': 'Unauthorized'}, status=403)
            
        barber = request.user.barber
        stats = {
            'total_appointments': Appointment.objects.filter(barber=barber).count(),
            'upcoming_appointments': Appointment.objects.filter(
                barber=barber,
                status__in=['pending', 'confirmed'],
                date__gte=timezone.now().date()
            ).count(),
            'earnings': sum(
                app.service.price for app in 
                Appointment.objects.filter(barber=barber, status='completed')
            ),
        }
        return Response(stats)

class AppointmentViewSet(ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == User.BARBER:
            return Appointment.objects.filter(barber=user.barber)
        return Appointment.objects.filter(customer=user)

    def perform_create(self, serializer):
        if self.request.user.user_type == User.CUSTOMER:
            serializer.save(customer=self.request.user)
        else:
            serializer.save(barber=self.request.user.barber)

    @action(detail=True, methods=['patch'])
    def accept(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'confirmed'
        appointment.save()
        # Send notification to customer
        return Response({'status': 'confirmed'})

    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'rejected'
        appointment.save()
        # Send notification to customer
        return Response({'status': 'rejected'})

class ReviewViewSet(ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=False, methods=['get'])
    def barber_reviews(self, request):
        barber_id = request.query_params.get('barber')
        if not barber_id:
            return Response({'error': 'Barber ID required'}, status=400)
            
        reviews = Review.objects.filter(barber_id=barber_id)
        serializer = self.get_serializer(reviews, many=True)
        return Response(serializer.data)