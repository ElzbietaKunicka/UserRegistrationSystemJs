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
const citiesList = [
  "Vilnius",
  "Kaunas",
  "Klaipėda",
  "Šiauliai",
  "Panevėžys",
  "Alytus",
  "Marijampolė",
  "Mažeikiai",
  "Jonava",
  "	Utena",
  "Kėdainiai",
  "Telšiai",
  "Ukmergė",
  "Tauragė",
  "	Visaginas",
  "	Plungė",
  "Kretinga",
  "Palanga",
  "Šilutė",
  "Radviliškis",
  "Gargždai",
  "Druskininkai"
];
citiesList.forEach(city => {
  const addCity = document.getElementById("persInfoCity");
  const optionList = document.createElement("option");
  optionList.textContent = city;
  addCity.append(optionList);
});

const getInformation = async () => {
  try {
    const response = await fetch(
      "http://localhost:5200/api/PersonalInformations/CurrentUserInfo",
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (response.ok) {
      const data = await response.json();
      const nameInput = document.getElementById("persInfoName");
      nameInput.value = data.name;
      const surnameInput = document.getElementById("persInfoSurname");
      surnameInput.value = data.surname;
      const personalCodeInput = document.getElementById("persInfoPersonalCode");
      personalCodeInput.value = data.personalCode;
      const phoneInput = document.getElementById("persInfoPhone");
      phoneInput.value = data.phone;
      const emailInput = document.getElementById("persInfoEmail");
      emailInput.value = data.email;
      const cityInput = document.getElementById("persInfoCity");
      cityInput.value = data.residentialAddress.city;
      const streetInput = document.getElementById("persInfoStreet");
      streetInput.value = data.residentialAddress.street;
      const homeNumberInput = document.getElementById("persInfoHomeNumber");
      homeNumberInput.value = data.residentialAddress.homeNumber;
      const apartmentNumberInput = document.getElementById(
        "persInfoApartmentNumber"
      );
      apartmentNumberInput.value = data.residentialAddress.homeNumber;
    }
  } catch (error) {
    console.error(error);
  }
};
getInformation();
const putInfo = async objectToSend => {
  try {
    const response = await fetch(
      "http://localhost:5200/api/PersonalInformations",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`
        },
        body: JSON.stringify(objectToSend)
      }
    );
    if (response.ok) {
      alert("Your Personal information has been successfully updated!");
      window.location.href = "./thenLogIn.html";
    } else {
      alert("Please make sure all fields are filled in correctly.");
    }
  } catch (error) {
    console.log(error);
  }
};
const form = document.getElementById("updateInfo_form");
form.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const surname = formData.get("surname");
  const personalCode = formData.get("personalCode");
  const phone = formData.get("phone");
  const email = formData.get("email");
  const city = formData.get("city");
  const street = formData.get("street");
  const homeNumber = formData.get("homeNumber");
  const apartmentNumber = formData.get("apartmentNumber");
  const formObject = {
    name,
    surname,
    personalCode,
    phone,
    email,
    residentialAddress: {
      city,
      street,
      homeNumber,
      apartmentNumber
    }
  };
  putInfo(formObject);
});
