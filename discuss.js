document.addEventListener("DOMContentLoaded", function () {
  const postsContainer = document.getElementById("posts-container");
  const postFormContainer = document.getElementById("post-form-container");
  const postForm = document.getElementById("post-form");
  const postTitleInput = document.getElementById("post-title");
  const postContentInput = document.getElementById("post-content");
  const createPostBtn = document.getElementById("create-post-btn");

  let posts = JSON.parse(localStorage.getItem("posts")) || [];

  function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
  }

  function createPostHTML(post, index) {
    return `
    <div class="post" id="post-${index}">
      <h2>${post.title}</h2>
      <p>${post.content}</p>
      <span>
        👍 <span id="likes-${index}">${post.likes}</span> | 
        👀 <span id="views-${index}">${post.views}</span> | 
        💬 <span id="comments-${index}">${post.comments}</span>
      </span>
      <br>
      <button class="like-btn" data-index="${index}">👍 Like</button>
      <button class="comment-btn" data-index="${index}">💬 Comment</button>
      <div class="comment-section" id="comment-section-${index}" style="display: none;">
        <input type="text" id="comment-input-${index}" placeholder="Write a comment...">
        <button class="submit-comment-btn" data-index="${index}">Post</button>
        <div id="comment-list-${index}">
          ${post.commentList.map((comment) => `<p>${comment}</p>`).join("")}
        </div>
      </div>
    </div>
  `;
  }

  function renderPosts() {
    postsContainer.innerHTML = "";
    posts.forEach((post, index) => {
      postsContainer.innerHTML += createPostHTML(post, index);
    });
    attachEventListeners();
  }

  function attachEventListeners() {
    document.querySelectorAll(".like-btn").forEach((button) => {
      button.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        posts[index].likes++;
        document.getElementById(`likes-${index}`).innerText =
          posts[index].likes;
        savePosts();
      });
    });

    document.querySelectorAll(".comment-btn").forEach((button) => {
      button.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        let commentSection = document.getElementById(
          `comment-section-${index}`
        );
        commentSection.style.display =
          commentSection.style.display === "none" ? "block" : "none";
      });
    });

    document.querySelectorAll(".submit-comment-btn").forEach((button) => {
      button.addEventListener("click", function () {
        let index = this.getAttribute("data-index");
        let commentInput = document.getElementById(`comment-input-${index}`);
        let commentList = document.getElementById(`comment-list-${index}`);

        if (commentInput.value.trim() !== "") {
          posts[index].commentList.push(commentInput.value);
          posts[index].comments++;
          document.getElementById(`comments-${index}`).innerText =
            posts[index].comments;
          commentList.innerHTML += `<p>${commentInput.value}</p>`;
          commentInput.value = "";
          savePosts();
        }
      });
    });
  }

  posts.forEach((post) => post.views++);
  savePosts();
  renderPosts();

  postForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const newPost = {
      title: postTitleInput.value,
      content: postContentInput.value,
      likes: 0,
      views: 1,
      comments: 0,
      commentList: [],
    };
    posts.unshift(newPost);
    savePosts();
    renderPosts();
    postForm.reset();
    postFormContainer.style.display = "none";
  });

  createPostBtn.addEventListener("click", function () {
    postFormContainer.style.display =
      postFormContainer.style.display === "none" ? "block" : "none";
  });
});
