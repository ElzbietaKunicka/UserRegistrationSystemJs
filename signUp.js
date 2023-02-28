const form = document.querySelector("#signUp_form");
function reset() {
  window.location.reload();
}
function backToLoginForm() {
  window.location.href = "./index.html";
}
form.addEventListener("submit", async e => {
  e.preventDefault();
  const userName = document.querySelector("#userName").value;
  const userPassword = document.querySelector("#password").value;
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
    const exceptionString = "A user with this username already exists.";
    const resultMessageContainer = document.getElementById("Messages");
    const messageParagraph = document.createElement("p");
    if (result === "A user with this username already exists.") {
      messageParagraph.style.color = "#ff3939";
      messageParagraph.textContent =
        "A user with this username already exists. Try again";
      setTimeout(reset, 5000);
    } else {
      messageParagraph.style.color = "#ff3998";
      messageParagraph.textContent = `System account is created. User name is ${result}.
      Now you can Login`;
      setTimeout(backToLoginForm, 3000);
    }
    resultMessageContainer.append(messageParagraph);
  } catch (error) {
    console.error(error);
  }
});
