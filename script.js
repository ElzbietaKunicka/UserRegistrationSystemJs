const form = document.querySelector("#logIn_form");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const userName = document.querySelector("#userName").value;
  const userPassword = document.querySelector("#password").value;
  try {
    const response = await fetch("http://localhost:5200/api/Accounts/Login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: userName,
        Password: userPassword
      })
    });
    if (response.ok) {
      const data = await response.text();
      document.cookie = `token=${data}`;
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
      let output = getCookie("token");
      GetPersonalInformationId();
    } else {
      alert(`Wrong username or password, try again`);
      location.href = "http://127.0.0.1:5501/index.html";
    }
  } catch (error) {
    console.error(error);
  }
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
  return JSON.parse(jsonPayload);
}
const GetPersonalInformationId = async () => {
  try {
    const response = await fetch(
      "http://localhost:5200/api/PersonalInformations/PersonalInformationId",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getCookie("token")}`
        }
      }
    );
    const result = await response.text();
    if (result == 0) {
      window.location.href = "./addNewInfo.html";
    } else {
      window.location.href = "./thenLogIn.html";
    }
  } catch (error) {
    console.log(error);
  }
};
