const map = L.map("map").setView([0, 0], 2);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;
  map.setView([latitude, longitude], 10);

  const marker = L.marker([latitude, longitude])
    .addTo(map)
    .bindPopup("You are here")
    .openPopup();

  // Fetch weather from our backend
  const response = await fetch(
    `http://localhost:3000/weather?lat=${latitude}&lon=${longitude}`
  );
  const data = await response.json();

  document.getElementById(
    "temperature"
  ).innerText = `Temperature: ${data.temperature} °C`;
  document.getElementById("humidity").innerText = `Humidity: ${data.humidity}%`;
  document.getElementById(
    "wind"
  ).innerText = `Wind Speed: ${data.windSpeed} m/s`;
});
