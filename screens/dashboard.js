/**
 * Function to toggle the visibility of the logout modal by changing its translateY transform property.
 */
function settingModal() {
  // Get the logout modal element
  let logout_modal = document.getElementById("logout-card");

  // Get the current transform value of the logout modal
  let currentTransform = logout_modal.style.transform;

  // Check if the modal is currently hidden
  if (currentTransform === "translateY(-120%)") {
    // If modal is hidden, show it by setting translateY to 0%
    logout_modal.style.transform = "translateY(0%)";
  } else {
    // If modal is visible, hide it by setting translateY to -120%
    logout_modal.style.transform = "translateY(-120%)";
  }
}


class UserManager {
  // Class representing a user manager for displaying and searching users.

  constructor(id, firstName, image) {
    // Creates an instance of UserManager.
    // @param {string} id - The ID of the user.
    // @param {string} firstName - The first name of the user.
    // @param {string} image - The image URL of the user.

    // Initialize properties
    this.usersList = document.getElementById("usersList");
    this.userSearch = document.getElementById("userSearch");
    this.id = id;
    this.firstName = firstName;
    this.image = image;

    // Attach event listener to user search input
    this.userSearch.addEventListener("onchange", () => {
      this.searchUsers(this.userSearch.value);
    });
  }

  displayUsers() {
    // Fetches and displays the list of users from an API.
    fetch("https://dummyjson.com/users")
      .then((res) => res.json())
      .then((data) => {
        // Get the list of users
        const users = data.users;

        // Loop through each user and display in the DOM
        users.forEach((user) => {
          const userElement = document.createElement("div");
          userElement.classList.add("message");
          userElement.innerHTML = `<div class="profile-pic">
                  <img src="${user.image}" />
                  <div class="active"></div>
                </div>
                <div class="message-body">
                  <h5 id="username">${user.firstName}</h5>
                  <p class="text-muted">${user.username}</p>
                </div>`;
          this.usersList.appendChild(userElement);
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  searchUsers(query) {
    // Searches for users based on the provided query.
    // @param {string} query - The search query.
    fetch(`https://dummyjson.com/users/search?q=${query}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("response not get");
        }
        return res.json();
      })
      .then((data) => data.users)
      .catch((error) => {
        console.error("search result: ", error);
      });
  }
}

// create new User
const userManager = new UserManager();
userManager.displayUsers();


/**
 * Function to fetch and display post cards along with user data and comments.
 */
function postCard() {
  // Fetch posts data
  fetch(`https://dummyjson.com/posts?limit=10&skip=5`)
    .then((res) => res.json())
    .then((postData) => {
      // Fetch user data
      fetch("https://dummyjson.com/users")
        .then((res) => res.json())
        .then((userData) => {
          // Retrieve posts and users data
          const posts = postData.posts;
          const users = userData.users;

          // Loop through each post
          posts.forEach((post, index) => {
            // Fetch comments for each post
            fetch(`https://dummyjson.com/comments/post/${post.id}`)
              .then((res) => res.json())
              .then((getallCommentsOnPosts) => {
                const comments = getallCommentsOnPosts.comments;

                // Display merged data in the DOM
                const postList = document.getElementById("postList");
                const userIndex = index % users.length;
                const user = users[userIndex];
                const postElement = document.createElement("div");
                postElement.classList.add("card", "mb-3", "p-3");
                postElement.innerHTML = `
                                <div class="post-header">
                                    <div class="user-name">
                                        <img src=${user.image} alt="" />
                                        <div class="user-info">
                                            <p id="user-name">${
                                              user.firstName
                                            }</p>
                                            <p>${user.address.address}</p>
                                        </div>
                                    </div>
                                    <i class="fa-solid fa-ellipsis" onclick="showProp()"></i>
                                </div>
                                
                                <img src="../Images/background1.jpg" class="card-img-top" />
                                <div class="card-body p-0">
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

                                    <div class="comment-section" id="comment-section">
                                        <h6>Comments</h6>
                                        ${comments
                                          .map(
                                            (comment) => `
                                            <div class="comment-wrapper" id="comment-wrapper-${post.id}">
                                                <p><b>${comment.user.username}:</b> ${comment.body} </p>
                                            </div>
                                            <div id="appendComment-${post.id}"></div>
                                            `
                                          )
                                          .join("")}
                                    </div>
                                          
                                    <div class="comment-box">
                                        <img src="${
                                          user.image
                                        }" alt="" />       
                                        <div class="input-group comment-grp">
                                            <input type="text" id="comment-input-${
                                              post.id
                                            }" class="comment-input" placeholder="Add a comment..." aria-label="Recipient's username" aria-describedby="button-addon2"/>
                                            <button class="comment-btn" onClick="postComment(${
                                              post.id
                                            })"><i class="fa-regular fa-paper-plane" ></i></button>
                                        </div>
                                    </div>
                                </div>
                            `;
                postList.appendChild(postElement);
              })
              .catch((error) => {
                console.error("Error fetching comment data:", error);
              });
          });
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching post data:", error);
    });
}

// Call the function to display post cards
postCard();


function postComment(postId) {
  let commentInput = document.getElementById(`comment-input-${postId}`);
  let commentText = commentInput.value.trim(); // Trim whitespace from the input text

  // Check if the comment text is empty
  if (commentText === "") {
    alert("Please enter text in the comment box.");
    return; // Exit the function if comment box is empty
  }

  fetch("https://dummyjson.com/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      body: commentText,
      postId: postId,
      userId: 5, // Assuming a fixed user ID for now
    }),
  })
    .then((res) => res.json())
    .then((addedComment) => {
      // console.log(addedComment.id);
      let commentWrapper = document.getElementById(`appendComment-${postId}`);
      let newComment = document.createElement("div");
      let userName = localStorage.getItem("Username");
      // newComment.classList.add("comment-wrapper");
      newComment.innerHTML = `
      <div class="comment-wrapper">
        <p><b>${userName}:</b> ${commentText}</p>
        
        <div class="comment-icon">
            <!-- Edit comment button -->
                <i class="fa-regular fa-pen-to-square" id="edit-comment"  onClick="editComment(${postId})"></i>
                                                  
            <!-- Delete comment button -->
                 <i class="fa-regular fa-trash-can"  onClick="deleteComent()"></i>
                                                      
        </div>
      </div>
    `;
      commentWrapper.appendChild(newComment);
      localStorage.setItem("NewComment", commentText);

      // Clear the comment input after posting
      commentInput.value = "";
    })
    .catch((error) => {
      console.error("Error posting comment:", error);
    });
}
// delete Comment Function
function deleteComent() {
  fetch(`https://dummyjson.com/comments/1`, {
    method: "DELETE",
  })
    .then((res) => {
      // console.log("////////------", commentId);
      if (!res.ok) {
        throw new Error("Failed to delete comment");
      }
      return res.json();
    })
    .then((data) => {
      // Assuming the API response contains some data about the deleted comment

      const deletedComment = data.comment;
      console.log(deletedComment);
      // let commentWrapper = document.getElementById(`appendComment-${postId}`);
      // commentWrapper.remove();
      localStorage.removeItem("NewComment");
      // Show a confirmation dialog using Swal
      Swal.fire({
        title: "Deleted!",
        text: "Your comment has been deleted.",
        icon: "success",
      });
    })
    .catch((error) => {
      console.error("Error deleting comment:", error);

      // Show an error message using Swal
      Swal.fire({
        title: "Failed",
        text: "Failed to delete the comment.",
        icon: "error",
        confirmButtonText: "OK",
        width: "fit-content",
      });
    });
}

// Edit Comment Function
function editComment(postId) {
  console.log("Post ID:", postId);
  fetch(`https://dummyjson.com/posts/${postId}`)
    .then((res) => res.json())
    .then((getPost) => {
      const post = getPost; // Assuming getPost contains the post data
      console.log("Post Data:", post);

      fetch(`https://dummyjson.com/comments/1`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: "I think I should shift to the moon",
        }),
      })
        .then((res) => res.json())
        .then((updatedComment) => {
          // Dynamically construct the ID of the comment input box based on the post ID
          const comment_Box = document.getElementById(
            `comment-input-${postId}`
          );
          // console.log("Comment Input Box:", comment_Box);
          if (comment_Box) {
            comment_Box.value = updatedComment.body;
            Swal.fire({
              title: "Edited!",
              text: "Your comment has been Edited.",
              icon: "success",
            });
          } else {
            console.error(
              `Element with ID 'comment-input-${postId}' not found.`
            );
          }
        })
        .catch((error) => {
          console.error("Error updating comment:", error);
          Swal.fire({
            title: "Failed",
            text: "Failed to edit comment.",
            icon: "error",
            confirmButtonText: "OK",
            width: "fit-content",
          });
        });
    })
    .catch((error) => {
      console.error("Error fetching post data:", error);
    });
}

function Logout() {
  // remove token from localStorage and redirect to login page
  localStorage.removeItem("token");
  localStorage.removeItem("LoggedInUserID");
  window.location.href = "Signup&Login.html";
}

function goToProfile() {
  // console.log("Go to next file Successfully")
  location.href = "profile.html";
}

function changeMode(){
  console.log("Darkmode enabled")
  let navBar= document.getElementById("nav-bar");
  let body = document.getElementsByTagName("body")
  let main = document.getElementsByTagName("main")
  // if(navBar.style.backgroundColor = "#FFEDEA" && body)
  navBar.style.backgroundColor="#083143";
  body.style.backgroundColor="#083143";
  main.style.backgroundColor="#083143";
  
} 
