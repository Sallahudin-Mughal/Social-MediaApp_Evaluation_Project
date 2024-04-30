// get elements by ID
const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const create_account = document.getElementById("create-account");
const goto_login = document.getElementById("goto-login");

// switch signup and login forms
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

create_account.addEventListener("click", () => {
  container.classList.add("active");
});
goto_login.addEventListener("click", () => {
  container.classList.remove("active");
});



let Signup = document.getElementById("signup-btn");

// Signup.addEventListener("click", () => {
//   // alert("hello");
//   console.log(U_name);
// });

// make class for get data from user when new user is going to register the constructor is called from this class
class UserManager {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.Password = password;
  }
}

// Authentication class is hold Signup and login method
class Authentication {
  static Signup() {
    // event.preventDefault();
    let username = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const newUser = new UserManager(username, email, password);

    // Add the new user to the array
    console.log(newUser);
    // users.push(newUser);

    // Store the updated array back to localStorage
    const JsonData = JSON.stringify(newUser);
    localStorage.setItem(username, JsonData);

    // console.log("User added successfully");
    // window.location.href = "dashboard.html";
    alert("User added successfully");
  }

  static Login() {
    // Prevent default form submission behavior
    // event.preventDefault();

    // Extract values from input fields
    const username = document.getElementById("login-user").value;
    const password = document.getElementById("login-pass").value;
    // const result = document.getElementById("result");

    // Make a request to the token API for authentication
    fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: username,
        password: password,
        expiresInMins: 30, // optional, defaults to 60
      }),
    })
      .then((res) => {
        // if response is not correct throw an error
        if (!res.ok) {
          throw new Error("Authentication failed");
        }
        return res.json();
      })
      .then((data) => {
        // variable for save token

        const token = data.token; // Assuming the API response contains a token field
        if (token) {
          // Store the token in localStorage for future authenticated requests
          localStorage.setItem("token", token);

          // Fetch user data from the users API
          fetch("https://dummyjson.com/users")
            .then((res) => res.json())
            .then((userData) => {
              // Find the user data and match to form data for the logged-in user
              const users = userData.users;
              const user = users.find((user) => user.username === username);

              // Store username firstname and image data in localStorage
              localStorage.setItem("Username", user.username);
              localStorage.setItem("LoggedInUserID", user.id);
              localStorage.setItem("FirstName", user.firstName);
              localStorage.setItem("UserProfile", user.image);

              // Show success message using Swal.fire
              Swal.fire({
                
                title: "Logging In",
                text: "Login Successfully.",
                icon: "success",
                
              }).then((result) => {
                if (result.isConfirmed) {
                  // Redirect to socialmedia dashboard page
                  window.location.href = "dashboard.html";
                }
              });
            })
            .catch((error) => {
              console.error("Error fetching user data:", error);
              throw new Error("Failed to fetch user data");
            });
        } else {
          // Authentication failed, display error message
          result.innerHTML = "Invalid username or password";
          throw new Error("Authentication failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle any errors that occurred during authentication
        Swal.fire({
          title: "Failed",
          text: "Invalid username or password",
          icon: "error",
          confirmButtonText: "OK",
          width: "fit-content",
        });
      });
  }
}
