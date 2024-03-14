let cartAmount = document.querySelector("#cart-button span");

// cartAmount.textContent =

const getCart = async () => {
  const response = await fetch("http://localhost:3000/trips/bookings");
  const responseData = await response.json();

  console.log(responseData);
  cartAmount.textContent = responseData.bookings.length;
};
getCart();

const getPurchases = async () => {
  const response = await fetch("http://localhost:3000/trips/purchases");
  const responseData = await response.json();
  const bookingsContainer = document.getElementById("filled-cart");

  if (responseData.purchases.length === 0 || !responseData.purchases) {
    bookingsContainer.innerHTML = `
          <p>No booking yet.</p>
          <p>Why not plan a trip?</p>
      `;
    return;
  }

  const h2Element = document.createElement("h2");
  h2Element.textContent = "My Bookings";
  bookingsContainer.appendChild(h2Element);

  // Create a container for travel lines
  const travelLines = document.createElement("div");
  travelLines.id = "travel-lines";

  for (const purchase of responseData.purchases) {
    const travelLine = document.createElement("div");
    travelLine.classList.add("train-line"); // Add the 'train-line' class

    const destination = document.createElement("div");
    destination.classList.add("destination");
    destination.textContent = `${purchase.destination}`;
    travelLine.appendChild(destination);

    const timetable = document.createElement("div");
    timetable.classList.add("time");
    timetable.textContent = `${purchase.time}`;
    travelLine.appendChild(timetable);

    const priceEl = document.createElement("div");
    priceEl.classList.add("price");
    priceEl.textContent = `${purchase.price}€`;
    travelLine.appendChild(priceEl);

    const timeLeft = document.createElement("div");
    timeLeft.classList.add("time-left");
    if (+purchase.timeLeft <= 0) {
      timeLeft.textContent = "Your train is departing shortly...";
    } else {
      timeLeft.textContent = `Departure in ${purchase.timeLeft} hour(s)`;
    }
    travelLine.appendChild(timeLeft);

    // Add the travel line to the container
    travelLines.appendChild(travelLine);
  }

  // Add travel lines to the container
  bookingsContainer.appendChild(travelLines);

  const cardBottom = document.createElement("div");
  cardBottom.id = "cart-bottom";
  cardBottom.innerHTML += `
    <div class="separation-bar"></div>
    <p id="message">Enjoy your travels with Tickethack!</p>
  `;
  bookingsContainer.appendChild(cardBottom);
};

getPurchases();
