
const table = document.querySelector("#table");

const getCookie = name => {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim().split("=");
    if (c[0] === name) {
      return decodeURIComponent(c[1]);
    }
  }
  return "";
};
function parseJwt() {
    let token = getCookie("token");
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    let jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    console.log(JSON.parse(jsonPayload));
    return JSON.parse(jsonPayload);
  }

  function getRole() {
    let jwt = parseJwt();
    console.log(
      jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    );
    return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  }
  getRole();

  if (getRole() == "Admin" || getRole() == "User") {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:5200/api/PersonalInformations", {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`
          }
        });
        if (response.ok) {
          const users = await response.json();
          users.forEach(user => {
            const row = document.createElement("tr");
            const brandCell = document.createElement("td");
            brandCell.textContent = user.name;
            const idCell = document.createElement("td");
            idCell.textContent = user.surname;
            const colorCell = document.createElement("td");
            colorCell.textContent = car.color;
  