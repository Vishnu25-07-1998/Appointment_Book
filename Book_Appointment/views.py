from django.shortcuts import render, redirect
from django.http import JsonResponse
from .models import Appointment
import json
from datetime import datetime

# Create your views here.

def home(request):
    return render(request, 'innerbase.html');

def get_available_slots(request):
    date = request.GET.get("date")
    if not date:
        return JsonResponse({"error": "Invalid date"}, status=400)

    booked_slots = list(Appointment.objects.filter(date=date).values_list("slots", flat=True))
    return JsonResponse({"booked_slots": booked_slots})

def book_appointment(request):
    if request.method == "POST":
        try:
            import json
            data = json.loads(request.body)

            date_str = data.get("date")
            slots = data.get("time")
            name = data.get("name")
            phone = data.get("phone")

           
            if not date_str or not slots or not name or not phone:
                return JsonResponse({"error": "All fields are required"}, status=400)

            date = datetime.strptime(date_str, "%Y-%m-%d").date()
            print('date : ', date, slots, phone );

           
            if Appointment.objects.filter(date=date, slots=slots).exists():
                return JsonResponse({"error": "Slot already booked"}, status=400)

            print("Save starting!")
            appointment = Appointment(name=name, phone=phone, date=date, slots=slots)
            print("Saved successfully!")
            print('Appointment : ', appointment)
            appointment.save()

            return JsonResponse({"message": "Appointment booked successfully!"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)

def get_appointments_by_date(request):
    if request.method == "GET":
        selected_date = request.GET.get("date")

        if not selected_date:
            return JsonResponse({"error": "Date is required"}, status=400)

        try:
            date = datetime.strptime(selected_date, "%Y-%m-%d").date()
            appointments = Appointment.objects.filter(date=date).values("name", "phone", "slots")
            print('appointments : ',appointments)

            return JsonResponse({"appointments": list(appointments)}, status=200)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request"}, status=400)
