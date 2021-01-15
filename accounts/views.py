from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth.models import User, auth
from .forms import RegistrationForm
from rest_framework import status
from rest_framework.views import APIView
from django.views.generic import TemplateView


class IndexPage(TemplateView):
    template_name = "index.html"


class LoginPage(TemplateView):
    template_name = "views/login.html"


class RegisterPage(TemplateView):
    template_name = "views/register.html"


class UserList(APIView):
    """
    List all active users, or create a new user.
    """

    def get(self, request, format=None):
        if request.user.is_authenticated:
            users = User.objects.order_by('username').filter(is_active=True)
            data = [{'id': user.id, 'username': user.username} for user in users]
            return Response(data, status=status.HTTP_200_OK)
        return Response({"errors": "not logged in"}, status=status.HTTP_401_UNAUTHORIZED)

    def post(self, request, format=None):
        user_name = None
        if request.user.is_authenticated:
            user_name = request.user.username
        else:
            errors = []
            details = RegistrationForm(request.POST)
            if details.is_valid():
                try:
                    details.make_save()
                    user_name = details.get_user_name()
                except Exception as e:
                    errors.append(str(e))
            else:
                errors = details.errors
            if len(errors) != 0:
                return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"name": user_name}, status=status.HTTP_200_OK)


class LoginLogoutList(APIView):
    """
    login users, or logout user.
    """

    def get(self, request, format=None):
        auth.logout(request)
        return Response({}, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        if not request.user.is_authenticated:
            user = auth.authenticate(username=request.POST['username'], password=request.POST['password'])
            if user is not None:
                auth.login(request, user)
            else:
                return Response({"errors": "Invalid Credentials"}, status=status.HTTP_403_FORBIDDEN)
        return Response({"name": request.user.username}, status=status.HTTP_200_OK)
