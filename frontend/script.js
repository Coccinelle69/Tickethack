const searchBtn = document.getElementById("search");
const imageHolder = document.querySelector("#trains-list img");
const textHolder = document.querySelector("#trains-list p");
const trainsList = document.getElementById("trains-list");
const errorMessage = document.createElement("div");
const searchTrainsForm = document.querySelector("#search-trains form");
errorMessage.id = "errors";
errorMessage.innerHTML = "";
let bookItems = 0;
const cartAmount = document.querySelector("#cart-button span");

searchBtn.addEventListener("click", async (event) => {
  // trainsList.innerHTML = "";
  event.preventDefault();
  errorMessage.innerHTML = "";

  const arrival = document.getElementById("arrival").value;
  const departure = document.getElementById("departure").value;
  const date = document.getElementById("date").value;
  try {
    const response = await fetch("http://localhost:3000/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        departure,
        arrival,
        date,
        currentTime: new Date(),
      }),
    });
    // if (!response.ok) {
    //  return
    // }
    const responseData = await response.json();

    if (responseData.errorMessage) {
      errorMessage.textContent = responseData.errorMessage;
      searchTrainsForm.parentNode.insertBefore(errorMessage, searchTrainsForm);
      return;
    }
    // trainsList.innerHTML = "";
    if (!responseData.trips || responseData.trips.length === 0) {
      trainsList.innerHTML = "";
      imageHolder.src = `./images/notfound.png`;
      imageHolder.alt = `Magnifying glass`;
      textHolder.textContent = "No trip found.";
      trainsList.append(imageHolder, textHolder);
      return;
    }

    console.log(responseData.trips);

    const trips = responseData.trips;
    trainsList.innerHTML = "";
    const tripElements = trips.map((trip) => {
      const extractedHours = new Date(trip.date)
        .getHours()
        .toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
      const extractedMinutes = new Date(trip.date)
        .getMinutes()
        .toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
      return `
    <div class="trip">
      <div class="destination">${trip.departure} > ${trip.arrival}</div>
      <div class="time">${extractedHours}:${extractedMinutes}</div>
      <div class="price">${trip.price}€</div>
      <button class="book">Book</button>
    </div>
  `;
    });
    trainsList.innerHTML = tripElements.join("");

    addBooking();
  } catch (error) {
    console.log(error);
  }

  // console.log(trips);
});

const arrivalElement = document.getElementById("arrival");
const departureElement = document.getElementById("departure");
const dateElement = document.getElementById("date");

arrivalElement.addEventListener("input", () => {
  errorMessage.remove();
});
departureElement.addEventListener("input", () => {
  errorMessage.remove();
});
dateElement.addEventListener("input", () => {
  errorMessage.remove();
});

const addBooking = async () => {
  const bookBtns = document.querySelectorAll(".book");
  for (const bookBtn of bookBtns) {
    bookBtn.addEventListener("click", async () => {
      bookItems++;
      cartAmount.textContent = bookItems;
      // imageHolder.src = `./images/train.png`;
      // imageHolder.alt = `Train`;
      // textHolder.textContent = "It's time to book your future trip.";
      // window.location.assign("cart.html");
      const tripElement = bookBtn.closest(".trip");
      const destination = tripElement.querySelector(".destination").textContent;
      const time = tripElement.querySelector(".time").textContent;
      const price = tripElement.querySelector(".price").textContent;

      const response = await fetch("http://localhost:3000/trips/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          time,
          price,
        }),
      });
    });
  }
};

const getCart = async () => {
  const response = await fetch("http://localhost:3000/trips/bookings");
  const responseData = await response.json();

  console.log(responseData);
  cartAmount.textContent = responseData.bookings.length;
};
getCart();

function updateDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
  const day = currentDate.getDate().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day}`;
  dateElement.value = formattedDate;
}

// Update the date initially
updateDate();

// Update the date daily (every 24 hours)
setInterval(updateDate, 24 * 60 * 60 * 1000);
