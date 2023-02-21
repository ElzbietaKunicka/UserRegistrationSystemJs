
const helloContainer = document.getElementById("hello");
const helloParagraph = document.createElement("p");
helloParagraph.textContent = "UserName";
helloParagraph.style.color = "blue";
helloContainer.append(helloParagraph);

// nameParagraf.textContent = user.name;
// const surnameParagraf = document.createElement("p");
// surnameParagraf.textContent = user.surname;

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

async function fetchUsers(){
  try{
    const response = await fetch("http://localhost:5200/api/PersonalInformations", {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json"
      }
    });

    if(response.ok){
      const users = await response.json();
      users.forEach(user => {
        const nameParagraf = document.createElement("p");
        nameParagraf.textContent = user.name;
        body.append(nameParagraf)
      
});

}
  }catch(error){
    console.error(error);
    
  }

}

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
