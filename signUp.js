const form = document.querySelector("#signUp");

form.addEventListener("submit", async e => {
  e.preventDefault();
  const userName = document.querySelector("#userName").value;
  const userPassword = document.querySelector("#password").value;
  console.log(userName);

  try {
    const response = await fetch("http://localhost:5200/api/Accounts/SignUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userName: userName,
        Password: userPassword
      })
    });
    const result = await response.text();

    if (result && result.length) {
      const resultMessageContainer = document.getElementById("Messages");
      const messageParagraph = document.createElement("p");
      messageParagraph.textContent = `System account is created. User name is ${result}.
             Now you can Login`;
      messageParagraph.style.color = "#555555";
      resultMessageContainer.append(messageParagraph);
    }

    setTimeout(time, 5000);
    function time() {
      window.location.href = "./index.html";
    }
  } catch (error) {
    console.error(error);
  }
});

