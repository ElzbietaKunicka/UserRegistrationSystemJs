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
  return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
}

function reset() {
  window.location.reload();
}

let getCurrentUserName = async () => {
  try {
    const response = await fetch(
      "http://localhost:5200/api/PersonalInformations/CurrentUserName",
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.ok) {
      const userName = await response.text();
      const nameParagraf = document.getElementById("current_username");
      nameParagraf.textContent = userName;
    }
  } catch (error) {
    console.error(error);
  }
};
getCurrentUserName();

const createSearchList = properties => {
  if (properties && properties.length) {
    properties.forEach(account => {
      const namesList = document.getElementById("search");
      const option = document.createElement("option");
      option.value = account.id + " " + account.userName;
      namesList.append(option);
    });
  }
};

let getAccountsIdAndUsernames = async () => {
  try {
    const response = await fetch(
      "http://localhost:5200/api/PersonalInformations/AccountsIdAndUsernames",
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json"
        }
      }
    );
    if (response.ok) {
      const data = await response.json();
      createSearchList(data);
    }
  } catch (error) {
    console.error("does not connecting to local database");
  }
};
getAccountsIdAndUsernames();

const searchForm = document.getElementById("search_form");
//  searchForm.addEventListener("submit", event => {
//   event.preventDefault();
//   const inputAccountId = document
//     .getElementById("search_input_Id")
//     .value.split(" ")[0];
//   console.log(inputAccountId);

//   getAccountPersonalInfo(inputAccountId);
// });

function getId() {
  return document.getElementById("search_input_Id").value.split(" ")[0];
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  getAccountPersonalInfo(getId());
});

let getAccountPersonalInfo = async accountId => {
  const errorMessageContainer = document.getElementById(
    "errorMessage_Container"
  );
  const searchOutputContainer = document.getElementById(
    "search_output_container"
  );
  const buttonBack = document.createElement("button");
  buttonBack.classList.add("formButton");
  buttonBack.innerHTML = "Back to search";
  searchOutputContainer.prepend(buttonBack);
  buttonBack.onclick = function () {
    reset();
  };
  const errorParagraph = document.getElementById("errorMessage");
  try {
    const response = await fetch(
      `http://localhost:5200/api/PersonalInformations/GetById/${accountId}`,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json"
        }
      }
    );
    const searchContainer = document.getElementById("search_input_container");
    searchContainer.innerHTML = "";
    const div = document.getElementById("selected_account_information");
    const userNameBySelectedId = document.getElementById(
      "selected_userName_by_id"
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      userNameBySelectedId.textContent = `${data.userName}`;
      if (data.personalInformation == null) {
        errorParagraph.textContent = "hasn't Filled Out Personal information";
      } else {
        const headingPersonalInfo = document.createElement("h3");
        headingPersonalInfo.textContent = "Personal Information:";
        const name = document.createElement("p");
        name.textContent = `Name: ${data.personalInformation.name}`;
        const surname = document.createElement("p");
        surname.textContent = `Surname: ${data.personalInformation.surname}`;
        const personalCode = document.createElement("p");
        personalCode.textContent = `PersonalCode: ${data.personalInformation.personalCode}`;

        const headingContact = document.createElement("h3");
        headingContact.textContent = "Contact Information:";
        const phone = document.createElement("p");
        phone.textContent = `Phone: ${data.personalInformation.phone}`;
        const email = document.createElement("p");
        email.textContent = `Email: ${data.personalInformation.email}`;

        const headingAddress = document.createElement("h3");
        headingAddress.textContent = "Address";
        const city = document.createElement("p");
        city.textContent = `City: ${data.personalInformation.residentialAddress.city}`;
        const street = document.createElement("p");
        street.textContent = `Street: ${data.personalInformation.residentialAddress.street}`;
        const homeNumber = document.createElement("p");
        homeNumber.textContent = `HomeNumber: ${data.personalInformation.residentialAddress.homeNumber}`;
        const apartmentNumber = document.createElement("p");
        apartmentNumber.textContent = `ApartmentNumber: ${data.personalInformation.residentialAddress.apartmentNumber}`;
        div.append(
          headingPersonalInfo,
          name,
          surname,
          personalCode,
          headingContact,
          phone,
          email,
          headingAddress,
          city,
          street,
          homeNumber,
          apartmentNumber
        );
      }
    }
  } catch (error) {
    errorParagraph.textContent = "The user ID you entered does not exist.";
  }
};

function createDeleteBtn() {
  const adminContainer = document.getElementById("search_output_container");
  const button = document.createElement("button");
  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    adminContainer.append(button);
    button.textContent = "Delete account";
    button.setAttribute("class", "formButton");
    button.setAttribute("type", "submit");
    button.dataset.id = getId();
    console.log(getId());

    //then click button delete
    button.addEventListener("click", e => {
      e.preventDefault();
      const accountId = button.dataset.id;
      const confirmed = confirm("Are you sure?");
      if (accountId && confirmed) {
        deleteAccount(accountId);
      }
    });
  });
}

if (getRole() == "Admin") {
  createDeleteBtn();
}

const deleteAccount = async accountId => {
  const response = await fetch(
    `http://localhost:5200/api/PersonalInformations/${accountId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getCookie("token")}`
      }
    }
  );
  if (response.ok) {
    alert("Account has been successfully deleted!");
    reset();
  }
};

// if (getRole() == "User") {
//   searchForm.addEventListener("submit", event => {
//     event.preventDefault();
// //     const paratext = document.getElementById("selected_userName_by_id");
// // const text = paratext.textContent;
// // console.log(text);
//     const button = document.createElement("button");
//     const adminContainer = document.getElementById("search_output_container");
//     adminContainer.append(button);
//     button.textContent = "Delete account";
//     button.setAttribute("class", "formButton");
//     button.setAttribute("type", "submit");

//     button.dataset.id = document
//       .getElementById("search_input_Id")
//       .value.split(" ")[0];

//     button.addEventListener("click", e => {
//       e.preventDefault();
//       const accountId =  button.dataset.id;
//       console.log(accountId);
//       //const accountId = e.target.dataset.id;
//       console.log(e.target.dataset.id);
//       const confirmed = confirm("Are you sure?");

//       if (accountId && confirmed) {
//         deleteAccount(accountId);
//       }
//     });
//   });

//   const deleteAccount = async accountId => {
//     const response = await fetch(
//       `http://localhost:5200/api/PersonalInformations/${accountId}`,
//       {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${getCookie("token")}`
//         }
//       }
//     );
//     if (response.ok) {
//       reset();
//     }
//   };
// }
