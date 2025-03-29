document.addEventListener("DOMContentLoaded", function () {
  const postsContainer = document.getElementById("posts-container");
  const postFormContainer = document.getElementById("post-form-container");
  const postForm = document.getElementById("post-form");
  const postTitleInput = document.getElementById("post-title");
  const postContentInput = document.getElementById("post-content");
  const createPostBtn = document.getElementById("create-post-btn");
  const postAsAdminCheckbox = document.getElementById("post-as-admin");
  const adminToggle = document.querySelector(".admin-toggle");
  const loginStatus = document.getElementById("login-status");
  const authModal = document.getElementById("auth-modal");
  const loginForm = document.getElementById("login-form");
  const closeModal = document.querySelector(".close-modal");

  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  // Initialize the auth controls
  function updateAuthUI() {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      loginStatus.innerHTML = `
        <div class="admin-indicator">
          <i class="fas fa-shield-alt"></i>
          <span>${currentUser.email}</span>
        </div>
        <button id="logout-btn" class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      `;
      
      // Show the admin toggle for post form
      if (adminToggle) adminToggle.style.display = "flex";
      
      // Add event listener to logout button
      document.getElementById("logout-btn").addEventListener("click", function() {
        AuthService.logout();
        updateAuthUI();
      });
    } else {
      loginStatus.innerHTML = `
        <button id="login-btn" class="login-btn">
          <i class="fas fa-lock"></i> Admin Login
        </button>
      `;
      
      // Hide the admin toggle for post form
      if (adminToggle) adminToggle.style.display = "none";
      
      // Add event listener to login button
      document.getElementById("login-btn").addEventListener("click", function() {
        authModal.style.display = "block";
      });
    }

    // Update comment controls visibility
    updateCommentControls();
  }

  // Update admin controls in comments
  function updateCommentControls() {
    const isAdmin = AuthService.isAdmin();

    document.querySelectorAll(".comment-admin-toggle").forEach(toggle => {
      toggle.style.display = isAdmin ? "flex" : "none";
    });
    
    // Also update the admin toggle in post form
    if (adminToggle) {
      adminToggle.style.display = isAdmin ? "flex" : "none";
    }
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      const user = AuthService.login(email, password);
      if (user) {
        authModal.style.display = "none";
        updateAuthUI();
      } else {
        alert("Login failed. Please check your credentials.");
      }
    });
  }

  // Close modal when clicking the X
  if (closeModal) {
    closeModal.addEventListener("click", function () {
      authModal.style.display = "none";
    });
  }

  // Close modal when clicking outside
  window.addEventListener("click", function (event) {
    if (event.target === authModal) {
      authModal.style.display = "none";
    }
  });

  function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
  }

  function createPostHTML(post, index) {
    // Add isAdmin property to post author if it exists
    const authorBadge = post.isAdmin ?
      `<span class="admin-badge"><i class="fas fa-shield-alt"></i> ADMIN</span>` : '';

    return `
    <div class="post" id="post-${index}">
      <h2>${post.title} ${authorBadge}</h2>
      <p>${post.content}</p>
      <span>
        👍 <span id="likes-${index}">${post.likes}</span> | 
        👀 <span id="views-${index}">${post.views}</span> | 
        💬 <span id="comments-${index}">${post.comments}</span>
      </span>
      <br>
      <button class="like-btn" data-index="${index}">👍 Like</button>
      <button class="comment-btn" data-index="${index}">💬 Comments</button>
      <div class="comment-section" id="comment-section-${index}" style="display: none;">
        <div class="comment-input-container">
          <input type="text" id="comment-input-${index}" placeholder="Write a comment...">
          <div class="comment-admin-toggle" style="display: none;">
            <input type="checkbox" id="comment-as-admin-${index}">
            <label for="comment-as-admin-${index}">Admin</label>
          </div>
          <button class="submit-comment-btn" data-index="${index}">Post</button>
        </div>
        <div id="comment-list-${index}" class="comment-list">
          ${renderComments(post.commentList)}
        </div>
      </div>
    </div>
  `;
  }

  // Render comments with admin badges
  function renderComments(comments) {
    return comments.map(comment => {
      const adminBadge = comment.isAdmin ?
        `<span class="admin-badge"><i class="fas fa-shield-alt"></i> ADMIN</span>` : '';

      return `<div class="comment ${comment.isAdmin ? 'admin-comment' : ''}">
        ${adminBadge}
        <div class="comment-text">${comment.text}</div>
      </div>`;
    }).join("");
  }

  function renderPosts() {
    postsContainer.innerHTML = "";
    posts.forEach((post, index) => {
      postsContainer.innerHTML += createPostHTML(post, index);
    });
    attachEventListeners();
    updateCommentControls();
  }

  function attachEventListeners() {
    document.querySelectorAll(".like-btn").forEach((button) => {
      button.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        posts[index].likes++;
        document.getElementById(`likes-${index}`).innerText = posts[index].likes;
        savePosts();
      });
    });

    document.querySelectorAll(".comment-btn").forEach((button) => {
      button.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        let commentSection = document.getElementById(`comment-section-${index}`);
        commentSection.style.display = commentSection.style.display === "none" ? "block" : "none";
      });
    });

    document.querySelectorAll(".submit-comment-btn").forEach((button) => {
      button.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        let commentInput = document.getElementById(`comment-input-${index}`);
        let commentList = document.getElementById(`comment-list-${index}`);

        // Check if admin checkbox exists and is checked
        const adminCheckbox = document.getElementById(`comment-as-admin-${index}`);
        const isAdmin = adminCheckbox && adminCheckbox.checked && AuthService.isAdmin();

        if (commentInput.value.trim() !== "") {
          // Store comment as object with text and isAdmin properties
          const newComment = {
            text: commentInput.value,
            isAdmin: isAdmin
          };

          posts[index].commentList.push(newComment);
          posts[index].comments++;
          document.getElementById(`comments-${index}`).innerText = posts[index].comments;

          // Add the new comment to the UI
          const adminBadge = isAdmin ?
            `<span class="admin-badge"><i class="fas fa-shield-alt"></i> ADMIN</span>` : '';

          commentList.innerHTML += `
            <div class="comment ${isAdmin ? 'admin-comment' : ''}">
              ${adminBadge}
              <div class="comment-text">${commentInput.value}</div>
            </div>
          `;

          commentInput.value = "";
          savePosts();
        }
      });
    });
  }

  // Update views when page loads
  posts.forEach((post) => post.views++);
  savePosts();
  renderPosts();

  // Handle post submission with admin check
  postForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const newPost = {
      title: postTitleInput.value,
      content: postContentInput.value,
      likes: 0,
      views: 1,
      comments: 0,
      commentList: [],
      isAdmin: postAsAdminCheckbox && postAsAdminCheckbox.checked && AuthService.isAdmin()
    };
    posts.unshift(newPost);
    savePosts();
    renderPosts();
    postForm.reset();
  });

  // Handle existing data migration (convert string comments to objects)
  function migrateCommentData() {
    let needsMigration = false;

    posts.forEach(post => {
      if (post.commentList && post.commentList.length) {
        post.commentList = post.commentList.map(comment => {
          // If it's a string, convert it to an object
          if (typeof comment === 'string') {
            needsMigration = true;
            return { text: comment, isAdmin: false };
          }
          return comment;
        });
      }
    });

    if (needsMigration) {
      savePosts(); // Save the migrated data
    }
  }

  // Run migration for existing data
  migrateCommentData();

  // Initialize auth UI
  updateAuthUI();

  createPostBtn.addEventListener("click", function () {
    postFormContainer.style.display =
      postFormContainer.style.display === "none" ? "block" : "none";
  });
});
