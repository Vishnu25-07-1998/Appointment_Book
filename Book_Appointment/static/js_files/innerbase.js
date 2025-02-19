document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("appointmentModal");
    const openModal = document.getElementById("bookAppointment");
    const closeModal = document.querySelector(".close");
    const dateInput = document.getElementById("date");
    const slotsContainer = document.getElementById("slotsContainer");
    const timeSlotsDiv = document.getElementById("timeSlots");
    const confirmButton = document.getElementById("confirmBooking");
    const nameField = document.getElementById("nameField");
    const phoneField = document.getElementById("phoneField");
    const nameInput = document.getElementById("name");
    const phoneInput = document.getElementById("phone")

    function getCSRFToken() {
        return document.querySelector("[name=csrfmiddlewaretoken]").value;
    }

    
    const allSlots = [
        "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM", "12:00 PM - 1:00 PM",
        "2:00 PM - 3:00 PM", "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM"
    ];

    
    openModal.addEventListener("click", function (event) {
        event.preventDefault();
        modal.style.display = "flex";
    });

    
    closeModal.addEventListener("click", function () {
        modal.style.display = "none";
    });

  
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

   
    dateInput.addEventListener("change", function () {
        const selectedDate = dateInput.value;
        if (selectedDate) {
            fetch(`/get-slots/?date=${selectedDate}`)
                .then(response => response.json())
                .then(data => {
                    const bookedSlots = data.booked_slots || [];
                    console.log("bookedSlots : ", bookedSlots);
                    timeSlotsDiv.innerHTML = ""; 
                    slotsContainer.style.display = "block"; 

                    allSlots.forEach(slot => {
                        const button = document.createElement("button");
                        button.textContent = slot;
                        button.classList.add("slot-button");

                        if (bookedSlots.includes(slot)) {
                            button.disabled = true;
                            button.classList.add("disabled-slot");
                        } else {
                            button.addEventListener("click", (event) => {
                                event.preventDefault()
                                document.querySelectorAll(".slot-button").forEach(btn => btn.classList.remove("selected"));
                                button.classList.add("selected");
                                nameField.style.display = "block";
                                phoneField.style.display = "block";
                                confirmButton.style.display = "block";
                            });
                        }

                        timeSlotsDiv.appendChild(button);
                    });
                })
                .catch(error => console.error("Error fetching slots:", error));
        }
    });

  
    confirmButton.addEventListener("click", function (event) {
        event.preventDefault();
        const selectedDate = dateInput.value;
        const selectedSlot = document.querySelector(".slot-button.selected")?.textContent;
        const userName = nameInput.value.trim();
        const userPhone = phoneInput.value.trim();

        console.log("selectedDate", selectedDate , "selectedSlot : ", selectedSlot, "userName : ", userName, "userPhone : ", userPhone)

        if (!selectedDate || !selectedSlot || !userName || !userPhone) {
            alert("Please fill in all fields before confirming.");
            return;
        }

        fetch("/book-appointment/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()  
            },
            body: JSON.stringify({ date: selectedDate, time: selectedSlot, name: userName, phone: userPhone })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            modal.style.display = "none";
        })
        .catch(error => console.error("Error booking:", error));
    });

    const appointmentDate = document.getElementById("appointmentDate");
    const appointmentDetails = document.getElementById("appointmentDetails");

    appointmentDate.addEventListener("change", function () {
        const selectedDate = appointmentDate.value;
        if (!selectedDate) return;

        fetch(`/get_appointments/?date=${selectedDate}`)
            .then(response => response.json())
            .then(data => {
                appointmentDetails.innerHTML = ""; 

                if (data.appointments.length === 0) {
                    appointmentDetails.innerHTML = "<p>No appointments found for this date.</p>";
                    return;
                }

                const list = document.createElement("ul");

                data.appointments.forEach(app => {
                    const item = document.createElement("li");
                    item.textContent = `📅 ${app.slots} - ${app.name} 📞 ${app.phone}`;
                    list.appendChild(item);
                });

                appointmentDetails.appendChild(list);
            })
            .catch(error => console.error("Error fetching appointments:", error));
    });
});
