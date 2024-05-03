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
let currentIndex = 0; // Variable to keep track of the current index of posts

function postCard(index) {
  // Fetch posts data with pagination
  fetch(`https://dummyjson.com/posts?limit=10&skip=${index}`)
    .then((res) => res.json())
    .then((postData) => {
      // Fetch user data
      fetch("https://dummyjson.com/users")
        .then((res) => res.json())
        .then((userData) => {
          const posts = postData.posts;
          const users = userData.users;

          posts.forEach((post) => {
            // Fetch comments for each post
            fetch(`https://dummyjson.com/comments/post/${post.id}`)
              .then((res) => res.json())
              .then((getallCommentsOnPosts) => {
                const comments = getallCommentsOnPosts.comments;

                // Display merged data in the DOM
                const postList = document.getElementById("postList");
                const userIndex = Math.floor(Math.random() * users.length); // Randomize user selection
                const user = users[userIndex];
                const postElement = document.createElement("div");
                postElement.classList.add("card", "mb-3", "p-3");
                postElement.innerHTML = `
                <div class="post-header">
                    <div class="user-name">
                        <img src=${user.image} alt="" />
                        <div class="user-info">
                            <p id="user-name">${user.firstName}</p>
                            <p>${user.address.address}</p>
                        </div>
                    </div>
                    <i class="fa-solid fa-ellipsis"></i>
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
                        <img src="${user.image}" alt="" />       
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

          // Update currentIndex for next batch of posts
          currentIndex += 10;

          // Check if there are more posts to display
          if (currentIndex < postData.total) {
            // Show the "Show more" button
            // document.getElementById("showMoreBtn").style.display = "block";
          } else {
            // Hide the "Show more" button if no more posts available
            // document.getElementById("showMoreBtn").style.display = "none";
          }
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    })
    .catch((error) => {
      console.error("Error fetching post data:", error);
    });
}

// Initial call to fetch and display the first 10 posts
postCard(currentIndex);

// Event listener for the "Show more" button
// document.getElementById("showMoreBtn").addEventListener("click", () => {
//   postCard(currentIndex);
// });

// Call the function to display post cards
postCard();

function updateDOM(posts) {
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.textContent = post.title; // Assuming there's a 'title' field in each post
    postsContainer.appendChild(postElement);
  });
}

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

// logout function in this function token and user ID is remove from local storage

// class PostCard {
//   constructor() {}

//   // Method to fetch posts data and display post cards
//   static async fetchAndDisplayPosts() {
//     try {
//       const postData = await fetch("https://dummyjson.com/posts?limit=10&skip=5").then(res => res.json());
//       const userData = await fetch("https://dummyjson.com/users").then(res => res.json());

//       const posts = postData.posts;
//       const users = userData.users;

//       posts.forEach(async (post, index) => {
//         const comments = await PostComment.fetchComments(post.id);

//         const userIndex = index % users.length;
//         const user = users[userIndex];

//         const postElement = document.createElement("div");
//         postElement.classList.add("card", "mb-3", "p-3");
//         postElement.innerHTML = `
//           <div class="post-header">
//             <div class="user-name">
//               <img src=${user.image} alt="" />
//               <div class="user-info">
//                 <p id="user-name">${user.firstName}</p>
//                 <p>${user.address.address}</p>
//               </div>
//             </div>
//             <i class="fa-solid fa-ellipsis" onclick="showProp()"></i>
//           </div>
//           <img src="../Images/background1.jpg" class="card-img-top" />
//           <div class="card-body p-0">
//             <div class="actions">
//               <div>
//                 <i class="bi bi-heart"></i>
//                 <i class="bi bi-chat"></i>
//                 <i class="bi bi-share"></i>
//               </div>
//               <i class="bi bi-bookmark"></i>
//             </div>
//             <div class="liked-by-info">
//               <div class="liked-persons">
//                 <img src="../Images/prof6.jpg" />
//                 <img src="../Images/prof3.jpg" />
//                 <img src="../Images/prof5.webp" />
//               </div>
//               <p>Liked by <b>ulfatrasool</b> and <b>999 others</b></p>
//             </div>
//             <div>${post.body}</div>
//             <div class="comment-section" id="comment-section-${post.id}"></div>
//             <div class="comment-box">
//               <img src="${user.image}" alt="" />
//               <div class="input-group comment-grp">
//                 <input type="text" id="comment-input-${post.id}" class="comment-input" placeholder="Add a comment..." aria-label="Recipient's username" aria-describedby="button-addon2"/>
//                 <button class="comment-btn" onClick="PostComment.postComment(${post.id})"><i class="fa-regular fa-paper-plane" ></i></button>
//               </div>
//             </div>
//           </div>
//         `;
//         document.getElementById("postList").appendChild(postElement);

//         // Display comments
//         comments.forEach(comment => {
//           const commentSection = document.getElementById(`comment-section-${post.id}`);
//           const commentWrapper = document.createElement("div");
//           commentWrapper.classList.add("comment-wrapper");
//           commentWrapper.innerHTML = `<p><b>${comment.user.username}:</b> ${comment.body}</p>`;
//           commentSection.appendChild(commentWrapper);
//         });
//       });
//     } catch (error) {
//       console.error("Error fetching and displaying posts:", error);
//     }
//   }
// }

// class PostComment {
//   constructor() {}

//   // Method to fetch comments for a specific post
//   static async fetchComments(postId) {
//     try {
//       const getallCommentsOnPosts = await fetch(`https://dummyjson.com/comments/post/${postId}`).then(res => res.json());
//       return getallCommentsOnPosts.comments;
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//       return [];
//     }
//   }

//   // Method to post a comment for a specific post
//   static async postComment(postId) {
//     try {
//       const commentInput = document.getElementById(`comment-input-${postId}`);
//       const commentText = commentInput.value.trim();

//       if (commentText === "") {
//         alert("Please enter text in the comment box.");
//         return;
//       }

//       const addedComment = await fetch("https://dummyjson.com/comments/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           body: commentText,
//           postId: postId,
//           userId: 5,
//         }),
//       }).then(res => res.json());

//       const commentWrapper = document.getElementById(`comment-section-${postId}`);
//       const userName = localStorage.getItem("Username");
//       const newComment = document.createElement("div");
//       newComment.classList.add("comment-wrapper");
//       newComment.innerHTML = `<p><b>${userName}:</b> ${commentText}</p>`;
//       commentWrapper.appendChild(newComment);

//       localStorage.setItem("NewComment", commentText);
//       commentInput.value = "";
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   }

//   // Method to delete a comment
//   static async deleteComment(commentId, postId) {
//     try {
//       const res = await fetch(`https://dummyjson.com/comments/${commentId}`, {
//         method: "DELETE",
//       });

//       if (!res.ok) {
//         throw new Error("Failed to delete comment");
//       }

//       const data = await res.json();
//       const deletedComment = data.comment;
//       console.log(deletedComment);
//       // You can update the UI here to remove the deleted comment if needed
//       localStorage.removeItem("NewComment");
//       Swal.fire({
//         title: "Deleted!",
//         text: "Your comment has been deleted.",
//         icon: "success",
//       });
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//       Swal.fire({
//         title: "Failed",
//         text: "Failed to delete the comment.",
//         icon: "error",
//         confirmButtonText: "OK",
//         width: "fit-content",
//       });
//     }
//   }

//   // Method to edit a comment
//   static async editComment(postId, commentId) {
//     try {
//       const getPost = await fetch(`https://dummyjson.com/posts/${postId}`).then(res => res.json());
//       const post = getPost;

//       const updatedComment = await fetch(`https://dummyjson.com/comments/${commentId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           body: "I think I should shift to the moon",
//         }),
//       }).then(res => res.json());

//       const commentInput = document.getElementById(`comment-input-${postId}`);
//       if (commentInput) {
//         commentInput.value = updatedComment.body;
//         Swal.fire({
//           title: "Edited!",
//           text: "Your comment has been edited.",
//           icon: "success",
//         });
//       } else {
//         console.error(`Element with ID 'comment-input-${postId}' not found.`);
//       }
//     } catch (error) {
//       console.error("Error updating comment:", error);
//       Swal.fire({
//         title: "Failed",
//         text: "Failed to edit comment.",
//         icon: "error",
//         confirmButtonText: "OK",
//         width: "fit-content",
//       });
//     }
//   }
// }

// // Usage
// PostCard.fetchAndDisplayPosts();

// class PostCard {
//   constructor() {}

//   // Method to fetch posts data and display post cards
//   static async fetchAndDisplayPosts() {
//     try {
//       const postData = await fetch("https://dummyjson.com/posts?limit=10&skip=5").then(res => res.json());
//       const userData = await fetch("https://dummyjson.com/users").then(res => res.json());

//       const posts = postData.posts;
//       const users = userData.users;

//       posts.forEach(async (post, index) => {
//         const comments = await PostComment.fetchComments(post.id);

//         const userIndex = index % users.length;
//         const user = users[userIndex];

//         const postElement = document.createElement("div");
//         postElement.classList.add("card", "mb-3", "p-3");
//         postElement.innerHTML = `
//           <div class="post-header">
//             <div class="user-name">
//               <img src=${user.image} alt="" />
//               <div class="user-info">
//                 <p id="user-name">${user.firstName}</p>
//                 <p>${user.address.address}</p>
//               </div>
//             </div>
//             <i class="fa-solid fa-ellipsis" onclick="showProp()"></i>
//           </div>
//           <img src="../Images/background1.jpg" class="card-img-top" />
//           <div class="card-body p-0">
//             <div class="actions">
//               <div>
//                 <i class="bi bi-heart"></i>
//                 <i class="bi bi-chat"></i>
//                 <i class="bi bi-share"></i>
//               </div>
//               <i class="bi bi-bookmark"></i>
//             </div>
//             <div class="liked-by-info">
//               <div class="liked-persons">
//                 <img src="../Images/prof6.jpg" />
//                 <img src="../Images/prof3.jpg" />
//                 <img src="../Images/prof5.webp" />
//               </div>
//               <p>Liked by <b>ulfatrasool</b> and <b>999 others</b></p>
//             </div>
//             <div>${post.body}</div>
//             <div class="comment-section" id="comment-section-${post.id}"></div>
//             <div class="comment-box">
//               <img src="${user.image}" alt="" />
//               <div class="input-group comment-grp">
//                 <input type="text" id="comment-input-${post.id}" class="comment-input" placeholder="Add a comment..." aria-label="Recipient's username" aria-describedby="button-addon2"/>
//                 <button class="comment-btn" onClick="PostComment.postComment(${post.id})"><i class="fa-regular fa-paper-plane"></i></button>
//               </div>
//             </div>
//           </div>
//         `;
//         document.getElementById("postList").appendChild(postElement);

//         // Display comments
//         comments.forEach(comment => {
//           const commentSection = document.getElementById(`comment-section-${post.id}`);
//           const commentWrapper = document.createElement("div");
//           commentWrapper.classList.add("comment-wrapper");
//           commentWrapper.innerHTML = `<p><b>${comment.user.username}:</b> ${comment.body}</p>`;
//           commentSection.appendChild(commentWrapper);
//         });
//       });
//     } catch (error) {
//       console.error("Error fetching and displaying posts:", error);
//     }
//   }
// }

// class PostComment {
//   constructor() {}

//   // Method to fetch comments for a specific post
//   static async fetchComments(postId) {
//     try {
//       const getallCommentsOnPosts = await fetch(`https://dummyjson.com/comments/post/${postId}`).then(res => res.json());
//       return getallCommentsOnPosts.comments;
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//       return [];
//     }
//   }

//   // Method to post a comment for a specific post
//   static async postComment(postId) {
//     try {
//       const commentInput = document.getElementById(`comment-input-${postId}`);
//       const commentText = commentInput.value.trim();

//       if (commentText === "") {
//         alert("Please enter text in the comment box.");
//         return;
//       }

//       const addedComment = await fetch("https://dummyjson.com/comments/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           body: commentText,
//           postId: postId,
//           userId: 5,
//         }),
//       }).then(res => res.json());

//       const commentWrapper = document.getElementById(`comment-section-${postId}`);
//       const userName = localStorage.getItem("Username");
//       const newComment = document.createElement("div");
//       newComment.classList.add("comment-wrapper");
//       newComment.innerHTML = `<p><b>${userName}:</b> ${commentText}</p>`;
//       commentWrapper.appendChild(newComment);

//       localStorage.setItem("NewComment", commentText);
//       commentInput.value = "";
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   }
// }

// // Usage
// PostCard.fetchAndDisplayPosts();

function Logout() {
  // remove token from localStorage and redirect to login page
  localStorage.removeItem("token");
  localStorage.removeItem("LoggedInUserID");
  window.location.href = "../index.html";
}

// this function is redirect to current user profile page
function goToProfile() {
  // console.log("Go to next file Successfully")
  location.href = "profile.html";
}

function changeMode() {
  console.log("Darkmode enabled");
  let navBar = document.getElementById("nav-bar");
  let mainCont = document.getElementById("main-cont");
  let body = document.getElementById("body");
  if ((navBar.style.backgroundColor = "#393E46")) {
    // if(body.classList("main-cont")){}

    navBar.style.backgroundColor = "#180d08";
    body.classList.add("darkmode");
    mainCont.classList.add("darkmode");
  }
}

// class PostCardApp {
//   constructor() {
//     // Initialize variables
//     this.posts = [];
//     this.users = [];
//   }

//   async init() {
//     try {
//       await this.fetchPosts();
//       await this.fetchUsers();
//       this.displayPostCards();
//     } catch (error) {
//       console.error("Error initializing app:", error);
//     }
//   }

//   async fetchPosts() {
//     try {
//       const response = await fetch(`https://dummyjson.com/posts?limit=10&skip=5`);
//       const data = await response.json();
//       this.posts = data.posts;
//     } catch (error) {
//       throw new Error("Error fetching posts:", error);
//     }
//   }

//   async fetchUsers() {
//     try {
//       const response = await fetch("https://dummyjson.com/users");
//       const data = await response.json();
//       this.users = data.users;
//     } catch (error) {
//       throw new Error("Error fetching users:", error);
//     }
//   }

//   async displayPostCards() {
//     const postList = document.getElementById("postList");
//     for (const post of this.posts) {
//       const user = this.users[Math.floor(Math.random() * this.users.length)]; // Random user selection

//       // Fetch comments for the post
//       const comments = await this.fetchComments(post.id);

//       // Generate HTML for post and comments
//       const postElement = this.createPostElement(post, user, comments);
//       postList.appendChild(postElement);
//     }
//   }

//   async fetchComments(postId) {
//     try {
//       const response = await fetch(`https://dummyjson.com/comments/post/${postId}`);
//       const data = await response.json();
//       return data.comments;
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//       return [];
//     }
//   }

//   createPostElement(post, user, comments) {
//     const postElement = document.createElement("div");
//     postElement.classList.add("card", "mb-3", "p-3");
//     postElement.innerHTML = `
//         <div class="post-header">
//             <div class="user-name">
//                 <img src="${user.image}" alt="" />
//                 <div class="user-info">
//                     <p id="user-name">${user.firstName}</p>
//                     <p>${user.address.address}</p>
//                 </div>
//             </div>
//             <i class="fa-solid fa-ellipsis" onclick="showProp()"></i>
//         </div>

//         <img src="../Images/background1.jpg" class="card-img-top" />
//         <div class="card-body p-0">
//             <div class="actions">
//                 <div>
//                     <i class="bi bi-heart"></i>
//                     <i class="bi bi-chat"></i>
//                     <i class="bi bi-share"></i>
//                 </div>
//                 <i class="bi bi-bookmark"></i>
//             </div>
//             <div class="liked-by-info">
//                 <div class="liked-persons">
//                     <img src="../Images/prof6.jpg" />
//                     <img src="../Images/prof3.jpg" />
//                     <img src="../Images/prof5.webp" />
//                 </div>
//                 <p>Liked by <b>ulfatrasool</b> and <b>999 others</b></p>
//             </div>

//             <div>${post.body}</div>

//             <div class="comment-section" id="comment-section-${post.id}">
//                 <h6>Comments</h6>
//                 ${comments.map(comment => `
//                     <div class="comment-wrapper">
//                         <p><b>${comment.user.username}:</b> ${comment.body}</p>
//                     </div>
//                 `).join("")}
//             </div>

//             <div class="comment-box">
//                 <img src="${user.image}" alt="" />
//                 <div class="input-group comment-grp">
//                     <input type="text" id="comment-input-${post.id}" class="comment-input" placeholder="Add a comment..." aria-label="Recipient's username" aria-describedby="button-addon2"/>
//                     <button class="comment-btn" onClick="postComment(${post.id})"><i class="fa-regular fa-paper-plane" ></i></button>
//                 </div>
//             </div>
//         </div>
//     `;
//     return postElement;
//   }

// }
// class Comment {
//   constructor(postId, userId) {
//     this.postId = postId;
//     this.userId = userId;
//   }

//   async addComment(commentText) {
//     try {
//       const response = await fetch("https://dummyjson.com/comments/add", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           body: commentText,
//           postId: this.postId,
//           userId: this.userId,
//         }),
//       });
//       const addedComment = await response.json();
//       return addedComment;
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       throw new Error("Error adding comment:", error);
//     }
//   }

//   async deleteComment(commentId) {
//     try {
//       const response = await fetch(`https://dummyjson.com/comments/${commentId}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) {
//         throw new Error("Failed to delete comment");
//       }
//       const data = await response.json();
//       return data.comment;
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//       throw new Error("Error deleting comment:", error);
//     }
//   }

//   async editComment(commentId, newText) {
//     try {
//       const response = await fetch(`https://dummyjson.com/comments/${commentId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           body: newText,
//         }),
//       });
//       const updatedComment = await response.json();
//       return updatedComment;
//     } catch (error) {
//       console.error("Error editing comment:", error);
//       throw new Error("Error editing comment:", error);
//     }
//   }
// }

// Usage example:
// const postCardApp = new PostCardApp();
// postCardApp.init();

function CheckToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../index.html";
  }
}
CheckToken();
