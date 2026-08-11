"""
Views for the Django application.
Handles: Authentication, Dealers, Reviews, Car Makes/Models, Sentiment Analysis
"""

import json
import logging
import requests
import os
from django.http import JsonResponse
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import CarMake, CarModel

logger = logging.getLogger(__name__)

# Node.js microservice base URL
MICROSERVICE_URL = getattr(settings, 'MICROSERVICE_URL', 'http://localhost:3030')


# ─────────────────────────────────────────────
#  Authentication Views
# ─────────────────────────────────────────────

@csrf_exempt
def login_user(request):
    """Login endpoint. POST with username and password."""
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    user = authenticate(username=username, password=password)
    response_data = {'userName': username}
    if user is not None:
        login(request, user)
        response_data['status'] = 'Authenticated'
    else:
        response_data['status'] = 'Failed'
    return JsonResponse(response_data)


def logout_user(request):
    """Logout the current user."""
    username = request.user.username if request.user.is_authenticated else ''
    logout(request)
    return JsonResponse({'userName': username, 'status': 'Logged out'})


@csrf_exempt
def registration(request):
    """Register a new user. POST with username, first_name, last_name, email, password."""
    data = json.loads(request.body)
    username = data.get('userName')
    password = data.get('password')
    first_name = data.get('firstName', '')
    last_name = data.get('lastName', '')
    email = data.get('email', '')

    username_exist = False
    try:
        User.objects.get(username=username)
        username_exist = True
    except User.DoesNotExist:
        pass

    if not username_exist:
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email,
        )
        login(request, user)
        return JsonResponse({'userName': username, 'status': 'Authenticated'})
    else:
        return JsonResponse({'userName': username, 'error': 'Already Registered'})


def get_userinfo(request):
    """Return the current user's info."""
    if request.user.is_authenticated:
        return JsonResponse({
            'userName': request.user.username,
            'firstName': request.user.first_name,
            'lastName': request.user.last_name,
            'email': request.user.email,
        })
    return JsonResponse({'userName': '', 'status': 'Not authenticated'})


# ─────────────────────────────────────────────
#  Dealer Views (proxied to Node.js)
# ─────────────────────────────────────────────

def get_dealerships(request, state='All'):
    """Get all dealers or filter by state."""
    if state == 'All':
        endpoint = f"{MICROSERVICE_URL}/fetchdealers"
    else:
        endpoint = f"{MICROSERVICE_URL}/fetchdealers/{state}"
    try:
        response = requests.get(endpoint, timeout=10)
        dealers = response.json().get('dealers', [])
        return JsonResponse({'status': 200, 'dealers': dealers})
    except Exception as e:
        logger.error(f"Error fetching dealers: {e}")
        return JsonResponse({'status': 500, 'error': str(e)})


def get_dealer_details(request, dealer_id):
    """Get details for a specific dealer by ID."""
    endpoint = f"{MICROSERVICE_URL}/fetchdealer/{dealer_id}"
    try:
        response = requests.get(endpoint, timeout=10)
        dealer = response.json().get('dealer', {})
        return JsonResponse({'status': 200, 'dealer': dealer})
    except Exception as e:
        logger.error(f"Error fetching dealer {dealer_id}: {e}")
        return JsonResponse({'status': 500, 'error': str(e)})


def get_dealer_reviews(request, dealer_id):
    """Get all reviews for a specific dealer."""
    endpoint = f"{MICROSERVICE_URL}/fetchreviews/dealer/{dealer_id}"
    try:
        response = requests.get(endpoint, timeout=10)
        reviews_raw = response.json().get('reviews', [])
        # Attach sentiment to each review
        reviews_with_sentiment = []
        for review in reviews_raw:
            sentiment = get_sentiment_for_text(review.get('review', ''))
            review['sentiment'] = sentiment
            reviews_with_sentiment.append(review)
        return JsonResponse({'status': 200, 'reviews': reviews_with_sentiment})
    except Exception as e:
        logger.error(f"Error fetching reviews for dealer {dealer_id}: {e}")
        return JsonResponse({'status': 500, 'error': str(e)})


@csrf_exempt
def add_review(request):
    """Add a new review. POST with review data."""
    if request.method == 'POST':
        data = json.loads(request.body)
        endpoint = f"{MICROSERVICE_URL}/insertreview"
        try:
            response = requests.post(endpoint, json=data, timeout=10)
            return JsonResponse({'status': 200, 'result': response.json()})
        except Exception as e:
            logger.error(f"Error adding review: {e}")
            return JsonResponse({'status': 500, 'error': str(e)})
    return JsonResponse({'status': 400, 'error': 'Only POST allowed'})


# ─────────────────────────────────────────────
#  Car Makes/Models Views
# ─────────────────────────────────────────────

def get_cars(request):
    """Return all car makes and models."""
    car_makes = CarMake.objects.all()
    cars = []
    for make in car_makes:
        for model in make.models.all():
            cars.append({
                'CarMake': make.name,
                'CarModel': model.name,
                'Year': model.year,
                'Type': model.type,
            })
    return JsonResponse({'CarMakes': list(car_makes.values()), 'cars': cars})


# ─────────────────────────────────────────────
#  Sentiment Analysis
# ─────────────────────────────────────────────

POSITIVE_KEYWORDS = [
    'fantastic', 'excellent', 'great', 'amazing', 'wonderful', 'perfect',
    'love', 'awesome', 'outstanding', 'superb', 'brilliant', 'good',
    'happy', 'pleased', 'satisfied', 'recommend', 'best', 'friendly',
    'helpful', 'professional', 'nice', 'positive'
]

NEGATIVE_KEYWORDS = [
    'terrible', 'horrible', 'awful', 'bad', 'worst', 'poor', 'disappointing',
    'disappointed', 'hate', 'unhappy', 'rude', 'slow', 'broken', 'problem',
    'issue', 'wrong', 'never', 'avoid', 'waste', 'scam', 'lied', 'rip off'
]


def get_sentiment_for_text(text):
    """Keyword-based sentiment analysis."""
    text_lower = text.lower()
    pos_score = sum(1 for kw in POSITIVE_KEYWORDS if kw in text_lower)
    neg_score = sum(1 for kw in NEGATIVE_KEYWORDS if kw in text_lower)
    if pos_score > neg_score:
        return 'positive'
    elif neg_score > pos_score:
        return 'negative'
    return 'neutral'


def analyze_review(request, text):
    """Analyze the sentiment of the given review text."""
    sentiment = get_sentiment_for_text(text)
    return JsonResponse({'sentiment': sentiment, 'text': text})
