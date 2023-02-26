 ///

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

const postProperty = async objectToSend => {
  try {
    const response = await fetch(
      "http://localhost:5200/api/PersonalInformations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`
        },
        body: JSON.stringify(objectToSend)
      }
    );
    if (response.ok) {
      const resultMessageContainer = document.getElementById("statusMessages");
      const messageParagraph = document.createElement("p");
      messageParagraph.textContent = "Thank you for filling out your information!";
      messageParagraph.style.color = "pink";
      messageParagraph.style.paddingTop = "3rem";
      messageParagraph.style.fontSize = "2rem";
      resultMessageContainer.append(messageParagraph);

      setTimeout(time, 5000);
      function time() {
        window.location.href = "./thenLogIn.html";
      }
      
    } else {
      console.log(preview.error.name);
      
      alert("Please make sure all fields are filled in correctly.");
      
    }
  } catch (error) {
    console.log(error);
  }
};
const form = document.getElementById("addNewInfo_form");

form.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(form); //sukuriam objekta event.target
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
  postProperty(formObject);
});
