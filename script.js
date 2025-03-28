// Toggle Chatbot Visibility with animation
document.getElementById("chatbot-btn").addEventListener("click", function () {
  const chatContainer = document.getElementById("chat-container");
  chatContainer.classList.toggle("hidden");
  
  // Add visible class for animation
  if (!chatContainer.classList.contains("hidden")) {
    setTimeout(() => {
      chatContainer.classList.add("visible");
    }, 10);
  } else {
    chatContainer.classList.remove("visible");
  }
});

document.getElementById("close-chat").addEventListener("click", function () {
  const chatContainer = document.getElementById("chat-container");
  chatContainer.classList.remove("visible");
  
  // Add delay before hiding completely
  setTimeout(() => {
    chatContainer.classList.add("hidden");
  }, 300);
});

// Open Discussion Forum when Discuss Button is clicked
document.getElementById("discuss-btn").addEventListener("click", function () {
  window.location.href = "dis_forum.html";
});

// Send Message on Button Click or Enter Key
document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

// Initialize the chatbot with a welcome message
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(() => {
    addBotMessage("Hiii! 👋 I'm CodeMitra - CodeAIx chat assistant. How can I help you today?");
  }, 500);
});

// Predefined Questions
const predefinedQuestions = [
  "What is CodeAIx?",
  "How do I start learning C++?",
  "Technologies used in this project?",
  "How do I optimize my JavaScript code?",
  // "What are the key concepts in Object-Oriented Programming?",
  // "What is recursion and how does it work?",
  // "Can you explain the concept of time complexity?",
  // "What is dynamic programming?",
  // "How does a binary search algorithm work?",
  // "How do I debug a Java program?",
  // "What are REST APIs and how do they work?",
  // "What is the difference between SQL and NoSQL databases?",
  // "How can I deploy a React application?",
  // "What is middleware in Express.js?",
  // "How does authentication work in web applications?",
  // "What are common security vulnerabilities in web apps?",
  // "How do I manage state in React?",
  // "What is an event loop in JavaScript?",
  // "How can I handle large data sets in Python?",
  // "How do I improve my DSA (Data Structures and Algorithms) skills?",
  // "How can I contribute to open-source projects?"
];

// Predefined Responses
const botResponses = {
  "What is CodeAIx?":
    "CodeAIx is an AI-powered code editor for competitive programming, enabling intelligent debugging, cross-language conversion, and efficient code execution.",
  "How do I start learning C++?":
    "Start with basic syntax, loops, and functions. Then explore STL and competitive coding.",
  "Technologies used in this project?":
    "This project is built using HTML, CSS, JavaScript, and integrates AI for code analysis.",
  "How do I optimize my JavaScript code?":
    "Use efficient loops, minimize DOM manipulation, and leverage async functions.",
  "What are the key concepts in Object-Oriented Programming?":
    "Encapsulation, Abstraction, Inheritance, and Polymorphism.",
  "What is recursion and how does it work?":
    "Recursion is a function calling itself with a base case to stop infinite loops.",
  "Can you explain the concept of time complexity?":
    "Time complexity measures the efficiency of an algorithm, often denoted using Big O notation.",
  "What is dynamic programming?":
    "A method of solving problems by breaking them into smaller overlapping subproblems.",
  "How does a binary search algorithm work?":
    "Binary search divides a sorted array in half until the target element is found.",
  "How do I debug a Java program?":
    "Use debugging tools like breakpoints, logging, and exception handling.",
  "What are REST APIs and how do they work?":
    "REST APIs use HTTP methods to communicate between client and server.",
  "What is the difference between SQL and NoSQL databases?":
    "SQL databases are relational; NoSQL databases are non-relational, optimized for scalability.",
  "How can I deploy a React application?":
    "Use platforms like Vercel, Netlify, or deploy manually with Firebase or AWS.",
  "What is middleware in Express.js?":
    "Middleware functions process requests before reaching the final route handler.",
  "How does authentication work in web applications?":
    "Authentication verifies user identity using JWT, OAuth, or sessions.",
  "What are common security vulnerabilities in web apps?":
    "SQL Injection, XSS, CSRF, and improper authentication.",
  "How do I manage state in React?":
    "Using useState, useReducer, Context API, or state management libraries.",
  "What is an event loop in JavaScript?":
    "The event loop handles asynchronous operations in JS by pushing tasks to the queue.",
  "How can I handle large data sets in Python?":
    "Use NumPy, Pandas, and optimized data structures like generators.",
  "How do I improve my DSA (Data Structures and Algorithms) skills?":
    "Practice on LeetCode, CodeChef, and GeeksforGeeks regularly.",
  "How can I contribute to open-source projects?":
    "Find beginner-friendly GitHub repositories, read documentation, and submit pull requests.",
};

// Load Quick Questions - Modified to show shorter text
const quickQuestionsDiv = document.getElementById("quick-questions");
predefinedQuestions.forEach((q) => {
  let btn = document.createElement("button");
  btn.classList.add("quick-btn");
  
  // Truncate question text if it's too long
  let displayText = q;
  if (q.length > 18) {
    displayText = q.substring(0, 16) + "...";
  }
  
  btn.innerText = displayText;
  // Add the full question as a title for tooltip
  btn.title = q;
  btn.onclick = () => sendMessage(q);
  quickQuestionsDiv.appendChild(btn);
});

// Helper function to add user messages
function addUserMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "user-message");
  messageDiv.innerHTML = `<div class="message-icon user-icon"><i class="fas fa-user"></i></div><div class="message-content">${text}</div>`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Helper function to add bot messages
function addBotMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", "bot-message");
  messageDiv.innerHTML = `<div class="message-icon bot-icon"><i class="fas fa-robot"></i></div><div class="message-content">${text}</div>`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Helper function to show the bot is thinking
function showThinking() {
  const chatBox = document.getElementById("chat-box");
  const thinkingDiv = document.createElement("div");
  thinkingDiv.classList.add("typing-indicator");
  thinkingDiv.id = "thinking-indicator";
  
  thinkingDiv.innerHTML = `
    <div class="message-icon bot-icon"><i class="fas fa-robot"></i></div>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="typing-text">
      <span class="typing-animation">Processing query...</span>
    </span>
  `;
  
  chatBox.appendChild(thinkingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Helper function to remove the thinking indicator
function hideThinking() {
  const thinkingIndicator = document.getElementById("thinking-indicator");
  if (thinkingIndicator) {
    thinkingIndicator.remove();
  }
}

// Send Message Function with thinking animation
function sendMessage(text) {
  let userInput = text || document.getElementById("user-input").value;
  if (!userInput) return;

  // Clear input field
  document.getElementById("user-input").value = "";
  
  // Add user message
  addUserMessage(userInput);
  
  // Show thinking animation
  showThinking();
  
  // Simulate AI processing time (1-2 seconds)
  const thinkingTime = Math.random() * 1000 + 1000;
  
  setTimeout(() => {
    // Remove thinking indicator
    hideThinking();
    
    // Add bot response
    const response = botResponses[userInput] || 
      "I'm not sure about that, but you can discuss this topic in our forum!";
    
    addBotMessage(response);
  }, thinkingTime);
}
