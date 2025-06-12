document.addEventListener('DOMContentLoaded', () => {
    const profileDataContainer = document.getElementById('profile-data');
    const editProfileForm = document.getElementById('edit-profile-form');
    const profilePictureInput = document.getElementById('profile-picture');
    const bioInput = document.getElementById('bio');
    const updateProfileButton = document.getElementById('update-profile-button');
    const messageDiv = document.getElementById('profile-message');

    const userId = localStorage.getItem('user_id');

    function displayMessage(message, type = 'success') {
        messageDiv.textContent = message;
        messageDiv.className = `message ${type}`;
    }


    function fetchUserProfile() {
        fetch(`api/get_user_data.php?id=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    displayMessage(data.error, 'error');
                } else {
                    displayProfileData(data);
                }
            })
            .catch(error => {
                console.error('Error fetching profile data:', error);
                displayMessage('Failed to fetch profile data.', 'error');
            });
    }

    function displayProfileData(data) {
        if (profileDataContainer) {
            profileDataContainer.innerHTML = `
                <img src="${data.profile_picture ? data.profile_picture : 'assets/images/default_profile.png'}" alt="Profile Picture" style="width: 100px; height: 100px; border-radius: 50%;">
                <p><strong>Username:</strong> ${data.username}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>First Name:</strong> ${data.first_name || 'N/A'}</p>
                <p><strong>Last Name:</strong> ${data.last_name || 'N/A'}</p>
                <p><strong>Bio:</strong> ${data.bio || 'N/A'}</p>
            `;
        }

        if (editProfileForm) {
            bioInput.value = data.bio || '';
        }
    }


    if (updateProfileButton) {
        updateProfileButton.addEventListener('click', (event) => {
            event.preventDefault();

            const formData = new FormData();
            formData.append('profile_picture', profilePictureInput.files[0]);
            formData.append('bio', bioInput.value);
            formData.append('user_id', userId);

            fetch('api/update_profile.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    displayMessage(data.success);
                    fetchUserProfile(); // Refresh profile data after update
                } else if (data.error) {
                    displayMessage(data.error, 'error');
                } else {
                    displayMessage('An unknown error occurred.', 'error');
                }
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                displayMessage('Failed to update profile.', 'error');
            });
        });
    }

    fetchUserProfile();
});