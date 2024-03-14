// let cartAmount = document.querySelector("#cart-button span");
window.cartAmount = document.querySelector("#cart-button span");

let totalPrice = 0;

const getCart = async () => {
  try {
    const response = await fetch("http://localhost:3000/trips/bookings");
    const responseData = await response.json();
    console.log(responseData);

    const bookingsContainer = document.getElementById("filled-cart");
    if (responseData.bookings.length === 0 || !responseData.bookings) {
      bookingsContainer.innerHTML = `
          <p>No tickets in your cart.</p>
          <p>Why not plan a trip?</p>
      `;
      return;
    }

    // Add h2
    cartAmount.textContent = responseData.bookings.length;
    const h2Element = document.createElement("h2");
    h2Element.textContent = "My Cart";
    bookingsContainer.appendChild(h2Element);

    // Create a container for travel lines
    const travelLines = document.createElement("div");
    travelLines.id = "travel-lines";

    for (const booking of responseData.bookings) {
      const travelLine = document.createElement("div");
      travelLine.classList.add("train-line"); // Add the 'train-line' class

      const destination = document.createElement("div");
      destination.classList.add("destination");
      destination.textContent = `${booking.destination}`;
      travelLine.appendChild(destination);

      const timetable = document.createElement("div");
      timetable.classList.add("time");
      timetable.textContent = `${booking.time}`;
      travelLine.appendChild(timetable);

      const priceEl = document.createElement("div");
      priceEl.classList.add("price");
      priceEl.textContent = `${booking.price}`;
      travelLine.appendChild(priceEl);

      const deleteButton = document.createElement("button");
      deleteButton.classList.add("delete-button");
      deleteButton.textContent = "X";
      travelLine.appendChild(deleteButton);

      // Add the travel line to the container
      travelLines.appendChild(travelLine);

      const numericPrice = +booking.price.split("€")[0];
      totalPrice += numericPrice;

      deleteButton.addEventListener("click", async () => {
        await deleteBooking(booking._id);
        // Remove the travel line from the container when the booking is deleted
        travelLine.remove();
        cartAmount--;
        // Update the total price after deletion
        totalPrice -= numericPrice;
      });
    }

    // Add travel lines to the container
    bookingsContainer.appendChild(travelLines);

    // Add cart bottom
    const cartBottom = document.createElement("div");
    cartBottom.id = "cart-bottom";
    cartBottom.innerHTML = `
      <div id="total">Total: <span>${totalPrice}€</span></div>
      <button id="purchase-button">Purchase</button>
    `;
    bookingsContainer.appendChild(cartBottom);
    const purchaseBtn = document.getElementById("purchase-button");
    purchaseBtn.addEventListener("click", async () => {
      const trainLinesData = Array.from(travelLines.children).map(
        (trainLine) => {
          const destination =
            trainLine.querySelector(".destination").textContent;
          const time = trainLine.querySelector(".time").textContent;
          const price = trainLine.querySelector(".price").textContent;
          return { destination, time, price };
        }
      );
      console.log(trainLinesData);
      bookingsContainer.innerHTML = `
          <p>No tickets in your cart.</p>
          <p>Why not plan a trip?</p>
      `;
      await purchaseBooking(trainLinesData);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

getCart();

const deleteBooking = async (bookingId) => {
  await fetch(`http://localhost:3000/trips/bookings/${bookingId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

const purchaseBooking = async (trainsElements) => {
  console.log(trainsElements);
  const purchases = trainsElements.map((train) => ({
    ...train,
    timeNow: new Date(),
  }));

  cartAmount.textContent = 0;
  await fetch(`http://localhost:3000/trips/purchases`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ purchases }),
  });

  window.location.assign("bookings.html");
};
