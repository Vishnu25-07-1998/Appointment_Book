from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path("get-slots/", views.get_available_slots, name="get_slots"),
    path("book-appointment/", views.book_appointment, name="book_appointment"),
]
