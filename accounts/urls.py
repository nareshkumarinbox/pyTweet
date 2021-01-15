from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns

urlpatterns = [
    path('', views.IndexPage.as_view(), name="load_index_page"),
    path('load_login_page', views.LoginPage.as_view(), name="load_login_page"),
    path('load_register_page', views.RegisterPage.as_view(), name="load_register_page"),

    path('register', views.UserList.as_view(), name="register"),
    path('getUserList', views.UserList.as_view(), name="getUserList"),

    path('login', views.LoginLogoutList.as_view(), name="login"),
    path('logout', views.LoginLogoutList.as_view(), name="logout"),
]
urlpatterns = format_suffix_patterns(urlpatterns)
