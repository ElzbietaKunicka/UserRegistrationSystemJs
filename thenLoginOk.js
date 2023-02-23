
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
      const nameParagraf = document.getElementById("hello");
      nameParagraf.textContent = userName;
    }
  } catch (error) {
    console.error(error);
  }
}
getCurrentUserName();


const createAccountList = properties => {
  if (properties && properties.length) {
  properties.forEach(name => {
  const namesList = document.getElementById("search");
  const option = document.createElement("option");
  option.textContent = name;
  namesList.append(option);
});
      // const ulElem = document.getElementById("accountsName");
      // const lielem = document.createElement("li");
      // lielem.textContent = element;
      // ulElem.append(lielem);
}
}
let getAccountsNames = async () => {
  try {
    const response = await fetch(
      "http://localhost:5200/api/PersonalInformations/AccountsNames",
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
          "Content-Type": "application/json"
        }
      }
    );

    if (response.ok) {
      const data = await response.json();
      
      createAccountList(data);
    }
  } catch (error) {
    console.error(error);
  }
}
getAccountsNames();





// function getRole() {
//   let jwt = parseJwt();
//   console.log(
//     jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
//   );
//   return jwt["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
// }
// getRole();

//   if (getRole() == "Admin" || getRole() == "User") {
//     async function fetchUsers() {
//       try {
//         const response = await fetch("http://localhost:5200/api/PersonalInformations", {
//           headers: {
//             Authorization: `Bearer ${getCookie("token")}`
//           }
//         });
//         if (response.ok) {
//           const users = await response.json();
//           users.forEach(user => {

//             const getButton = document.createElement("button");
//            getButton.textContent = "Get";
//              getButton.addEventListener("click", async () => {
//             try {
//               const response = await fetch(
//                 `http://localhost:5200/api/PersonalInformations/`,
//                 {
//                   method: "GET",
//                   headers: {
//                     Authorization: `Bearer ${getCookie("token")}`
//                   }
//                 }
//               );
//               if (response.ok) {
//                 console.log("get info");
//               } else {
//                 console.error("Failed to get car");
//               }
//             } catch (error) {
//               console.error(error);
//             }
//           });
//         }
//       }
//     }
//   }
// }
