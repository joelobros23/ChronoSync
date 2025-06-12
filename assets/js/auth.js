document.addEventListener('DOMContentLoaded', function() {
  // Registration Form Handling
  const registerForm = document.querySelector('#registerForm'); // Assuming an ID of 'registerForm' in register.html
  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const username = document.querySelector('#registerUsername').value; // Assuming an ID of 'registerUsername'
      const password = document.querySelector('#registerPassword').value; // Assuming an ID of 'registerPassword'
      const email = document.querySelector('#registerEmail').value; // Assuming an ID of 'registerEmail'

      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      formData.append('email', email);

      fetch('api/register.php', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Registration failed');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          alert('Registration successful! Redirecting to login.');
          window.location.href = 'login.html';
        } else {
          alert('Registration failed: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Registration failed: ' + error.message);
      });
    });
  }

  // Login Form Handling
  const loginForm = document.querySelector('#loginForm'); // Assuming an ID of 'loginForm' in login.html
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();

      const username = document.querySelector('#loginUsername').value; // Assuming an ID of 'loginUsername'
      const password = document.querySelector('#loginPassword').value; // Assuming an ID of 'loginPassword'

      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      fetch('api/login.php', {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Login failed');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('username', data.username);
          alert('Login successful! Redirecting to home.');
          window.location.href = 'home.html';
        } else {
          alert('Login failed: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Login failed: ' + error.message);
      });
    });
  }
});