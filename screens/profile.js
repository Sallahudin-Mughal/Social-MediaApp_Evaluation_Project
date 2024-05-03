const loginInUser = localStorage.getItem("LoggedInUserID");
console.log(loginInUser);

document.addEventListener("DOMContentLoaded", function () {
  const postContainer = document.getElementById("postContainer");

  // Simulated logged-in user ID
  const loggedInUserId = parseInt(loginInUser); // Change this to the actual logged-in user ID

  // Function to fetch users and their posts
  function fetchUsersAndPosts() {
    fetch(`https://dummyjson.com/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        return response.json();
      })
      .then((data) => {
        const users = data.users; // Declare 'users' variable with const
        let user = users;
        console.log(user);

        // Find the logged-in user
        const loggedInUser = users.find((user) => user.id === loggedInUserId);

        if (!loggedInUser) {
          console.error("Logged-in user not found");
          return;
        }

        // Fetch posts for the logged-in user
        fetch(`https://dummyjson.com/posts/user/${loggedInUserId}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error(
                `Failed to fetch posts for user ${loggedInUserId}`
              );
            }
            return res.json();
          })
          .then((allPosts) => {
            // console.log(allPosts);

            const posts = allPosts.posts;

            // console.log(posts);

            // Display posts only for the logged-in user
            posts.forEach((post) => {
              const postCard = document.createElement("div");
              postCard.classList.add("card", "mb-3", "p-3", "post-card");
              postCard.innerHTML = `
                  <div class="post-header">
                    <div class="user-name">
                      <img src=${loggedInUser.image} alt="" />
                      <div class="user-info">
                        <p id="user-name">${loggedInUser.firstName} ${loggedInUser.lastName}</p>
                        <p>${loggedInUser.address.address}</p>
                      </div>
                    </div>
                    <i class="fa-solid fa-ellipsis" onclick="showProp()"></i>
                  </div>
                  <img src="../Images/background4.jpg" class="card-img-top" />
                  <div class="actions">
                    <div>
                      <i class="bi bi-heart"></i>
                      <i class="bi bi-chat"></i>
                      <i class="bi bi-share"></i>
                    </div>
                    <i class="bi bi-bookmark"></i>
                  </div>
                  <div class="liked-by-info">
                                        <div class="liked-persons">
                                            <img src="../Images/prof6.jpg" />
                                            <img src="../Images/prof3.jpg" />
                                            <img src="../Images/prof5.webp" />
                                        </div>
                                        <p>Liked by <b>ulfatrasool</b> and <b>999 others</b></p>
                                    </div>

                                    <div>${post.body}</div>
                `;

              postContainer.appendChild(postCard);

              
            });
          })
          .catch((error) => {
            console.error(error.message);
          });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  // Invoke the function to fetch users and their posts
  fetchUsersAndPosts();
});

document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch user data for the logged-in user
  function fetchLoggedInUserData() {
    // Assume you have a function to get the ID of the logged-in user
    const loggedInUserId = loginInUser;

    // Fetch user data for the logged-in user
    fetch(`https://dummyjson.com/users/${loggedInUserId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data for the logged-in user");
        }
        return response.json();
      })
      .then((userData) => {
        // Call a function to display the user data on the DOM
        displayUserData(userData);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }

  // Function to display user data on the DOM
  function displayUserData(userData) {
   

    console.log(userData)
    let userInformation = document.getElementById("user-information");
              userInformation.classList.add("card");
              userInformation.innerHTML = `
                    <div class="heading">
                                <h3>Intro</h3>
                    </div>
                    <div class="data">
                    <i class="fa-solid fa-house-chimney-user"></i>
                    <p><b>Lives in </b> ${userData.address.address}</p>
                    </div>
                    <div class="data">
                    <i class="fa-solid fa-location-dot"></i>
                    <p><b>From </b> ${userData.address.city} </p>
                    </div>
                    <div class="data">
                    <i class="fa-solid fa-envelope"></i>
                    <p><b>Email </b> ${userData.email} </p>
                    </div>
                    <div class="data">
                    <i class="fa-solid fa-phone"></i>                <p><b>Phone </b> ${userData.phone} </p>
                    </div>
                    <div class="data">
                    <i class="fa-solid fa-cake-candles"></i>
                    <p><b>Phone </b> ${userData.birthDate} </p>
                    </div>
    
                    `;
  }

  // Function to get the ID of the logged-in user (replace this with your actual implementation)
  function getLoggedInUserId() {
    // This is just a placeholder, replace it with your actual logic to get the user ID
    return 1; // Assuming the user ID is 1
  }

  // Call the function to fetch and display user data for the logged-in user
  fetchLoggedInUserData();
});


let username = localStorage.getItem("Username");
      let profilePicture = localStorage.getItem("UserProfile");
      let displayUsername = document.getElementById("username");
      // let UserProfilePic = document.getElementById("");
      displayUsername.innerText = username;

      const imageContainer = document.getElementById("user-Profile-pic");
      console.log(imageContainer);

      // Create img element
      const img = document.createElement("img");

      console.log(img);
      // Set src attribute with retrieved image data
      img.src = profilePicture;

      // Append the img element to the container
      imageContainer.appendChild(img);
