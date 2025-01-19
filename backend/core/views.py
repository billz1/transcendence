from django.shortcuts import render
from django.shortcuts import redirect
from django.contrib.auth import logout
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from urllib.parse import urlencode
from .models import CustomUser
from django.contrib.auth import login

import requests

@login_required
def me_view(request):
    user = request.user
    return JsonResponse({
        'username': user.username,
        'email': user.email,
        'avatar': user.avatar,
    })

def login_view(request):
    base_url = 'https://api.intra.42.fr/oauth/authorize'
    query_params = {
        'client_id': 'u-s4t2ud-effbb6b0247fb17e1ca03025d5297321cd799a89de8a5d5e45c390b5d75a2310',
        'redirect_uri': 'http://localhost:8000/auth/callback',
        'response_type': 'code',
    }
    url = f"{base_url}?{urlencode(query_params)}"
    return redirect(url)

def logout_view(request):
    logout(request)
    return redirect('/')

@login_required
def home_view(request):
    user = request.user
    return HttpResponse(f"""
        <h1>Welcome, {user.username}!</h1>
        <img src="{user.avatar}" alt="Avatar" style="width:100px; height:100px; border-radius:50%;">
        <p>Email: {user.email}</p>
        <a href="/auth/logout/">Logout</a>
    """)

def callback_view(request):
    code = request.GET.get('code')
    if not code:
        return JsonResponse({'error': 'No authorization code provided'}, status=400)

    #code for an access token
    token_url = 'https://api.intra.42.fr/oauth/token'
    token_data = {
        'grant_type': 'authorization_code',
        'client_id': 'u-s4t2ud-effbb6b0247fb17e1ca03025d5297321cd799a89de8a5d5e45c390b5d75a2310',
        'client_secret': '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',
        'redirect_uri': 'http://localhost:8000/auth/callback',
        'code': code,
    }
    response = requests.post(token_url, data=token_data)
    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to obtain access token'}, status=400)

    access_token = response.json().get('access_token')

    #fetch user info from the 42 API
    user_info_url = 'https://api.intra.42.fr/v2/me'
    user_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
    if user_response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch user info'}, status=400)

    user_data = user_response.json()
    username = user_data.get('login')
    email = user_data.get('email')
    avatar = user_data.get('image_url')

    
    user, created = CustomUser.objects.get_or_create(username=username, defaults={'email': email})
    if avatar:
        user.avatar = avatar
        user.save()

    #
    login(request, user)

    
    return redirect('http://localhost:3000/')
