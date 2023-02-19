const form = document.querySelector("#logIn");

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

      // document.cookie = `token=${data}`;
      // window.globalToken = document.cookie;
      // window.location.href = "./home.html";

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


      window.location.href = "./thenLogIn.html";
    } else {
      console.log("something wrong");
    }
  } catch (error) {
    console.error(error);
  }
});



