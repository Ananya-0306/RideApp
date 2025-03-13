async function bookRide() {
    const pickup = document.getElementById("pickup").value;
    const dropoff = document.getElementById("dropoff").value;
    const rideType = document.getElementById("rideType").value;
    const rideTime = document.getElementById("rideTime").value;
    const message = document.getElementById("message");

    if (pickup && dropoff && rideTime) {
        try {
            const response = await fetch("http://localhost:5000/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pickup, dropoff, rideType, rideTime }),
            });

            const result = await response.json();
            if (response.ok) {
                message.textContent = "✅ Ride booked successfully!";
                message.style.color = "#28a745";
                displayRecentRides(); // Refresh recent rides
            } else {
                message.textContent = "❌ " + result.error;
                message.style.color = "#ff4d4d";
            }
        } catch (error) {
            message.textContent = "❌ Error connecting to the server.";
            message.style.color = "#ff4d4d";
        }
    } else {
        message.textContent = "❌ Please enter all details.";
        message.style.color = "#ff4d4d";
    }
    
}
