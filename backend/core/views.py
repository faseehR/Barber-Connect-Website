from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def api_home(request):
    return Response({"message": "Yoooooooooooooooooooooooooooo"})

@api_view(['GET'])
def check(request):
    return Response({"message" : "Checking second API"})