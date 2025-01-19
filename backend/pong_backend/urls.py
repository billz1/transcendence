"""
URL configuration for pong_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import path, include
from core.views import logout_view
from core.views import me_view, logout_view
from core.views import home_view
from core import views  # Import your views here

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/login/', views.login_view, name='login'),  # Login with 42
    path('auth/callback/', views.callback_view, name='callback'),  # OAuth2 callback
    path('auth/me/', views.me_view, name='me'),  # User profile
    path('auth/logout/', views.logout_view, name='logout'),  # Logout
    path('', views.home_view, name='home'),  # Home page
]
