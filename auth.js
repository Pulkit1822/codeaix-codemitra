/**
 * Simple Authentication Service
 * Handles admin authentication and access control
 */
const AuthService = (function() {
  // Admin credentials
  const ADMIN_EMAIL = "pulkitmathur.tech@gmail.com";
  const ADMIN_PASSWORD = "admin123"; // In production, never hardcode passwords
  
  // User session storage key
  const USER_SESSION_KEY = 'forum_user_session';
  
  // Get current logged in user
  function getCurrentUser() {
    const userSession = localStorage.getItem(USER_SESSION_KEY);
    return userSession ? JSON.parse(userSession) : null;
  }
  
  // Check if current user is admin
  function isAdmin() {
    const currentUser = getCurrentUser();
    return currentUser && currentUser.email === ADMIN_EMAIL;
  }
  
  // Login function
  function login(email, password) {
    // Simple check for admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create a user session
      const userSession = {
        email: email,
        isAdmin: true,
        loginTime: new Date().toISOString()
      };
      
      // Store in localStorage
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(userSession));
      
      return userSession;
    }
    
    return null; // Login failed
  }
  
  // Logout function
  function logout() {
    localStorage.removeItem(USER_SESSION_KEY);
  }
  
  // Expose the API
  return {
    getCurrentUser,
    isAdmin,
    login,
    logout
  };
})();