"""URL patterns for djangoapp."""
from django.urls import path
from . import views

app_name = 'djangoapp'

urlpatterns = [
    # Authentication
    path('login', views.login_user, name='login'),
    path('logout', views.logout_user, name='logout'),
    path('register', views.registration, name='register'),
    path('userinfo', views.get_userinfo, name='userinfo'),

    # Dealers
    path('get_dealers', views.get_dealerships, name='get_dealers'),
    path('get_dealers/<str:state>', views.get_dealerships, name='get_dealers_by_state'),
    path('get_dealer/<int:dealer_id>', views.get_dealer_details, name='get_dealer'),

    # Reviews
    path('reviews/dealer/<int:dealer_id>', views.get_dealer_reviews, name='get_dealer_reviews'),
    path('add_review', views.add_review, name='add_review'),

    # Car Makes/Models
    path('get_cars', views.get_cars, name='get_cars'),

    # Sentiment Analysis
    path('analyze_review/<str:text>', views.analyze_review, name='analyze_review'),
]
