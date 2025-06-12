// assets/js/friends.js

document.addEventListener('DOMContentLoaded', () => {
    const friendRequestList = document.getElementById('friendRequestList');
    const friendList = document.getElementById('friendList');

    // Function to fetch friend requests
    const fetchFriendRequests = async () => {
        try {
            const response = await fetch('api/get_friends.php?status=pending');
            const data = await response.json();

            if (data.success) {
                displayFriendRequests(data.friends);
            } else {
                console.error('Error fetching friend requests:', data.message);
            }
        } catch (error) {
            console.error('Error fetching friend requests:', error);
        }
    };

    // Function to display friend requests
    const displayFriendRequests = (requests) => {
        if (!friendRequestList) return;

        friendRequestList.innerHTML = ''; // Clear existing list

        if (requests.length === 0) {
            friendRequestList.innerHTML = '<p>No pending friend requests.</p>';
            return;
        }

        requests.forEach(request => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                ${request.username}
                <button class="accept-request" data-user-id="${request.id}">Accept</button>
                <button class="reject-request" data-user-id="${request.id}">Reject</button>
            `;
            friendRequestList.appendChild(listItem);
        });

        // Add event listeners to accept/reject buttons
        const acceptButtons = document.querySelectorAll('.accept-request');
        acceptButtons.forEach(button => {
            button.addEventListener('click', handleAcceptRequest);
        });

        const rejectButtons = document.querySelectorAll('.reject-request');
        rejectButtons.forEach(button => {
            button.addEventListener('click', handleRejectRequest);
        });
    };

    // Function to handle accepting a friend request
    const handleAcceptRequest = async (event) => {
        const userId = event.target.dataset.userId;

        try {
            const response = await fetch('api/accept_friend_request.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `user_id=${userId}`
            });

            const data = await response.json();

            if (data.success) {
                fetchFriendRequests(); // Refresh friend requests list
                fetchFriends(); // Refresh friend list
            } else {
                console.error('Error accepting friend request:', data.message);
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    // Function to handle rejecting a friend request
    const handleRejectRequest = async (event) => {
        const userId = event.target.dataset.userId;

        try {
            const response = await fetch('api/reject_friend_request.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `user_id=${userId}`
            });

            const data = await response.json();

            if (data.success) {
                fetchFriendRequests(); // Refresh friend requests list
            } else {
                console.error('Error rejecting friend request:', data.message);
            }
        } catch (error) {
            console.error('Error rejecting friend request:', error);
        }
    };

    // Function to fetch friends
    const fetchFriends = async () => {
        try {
            const response = await fetch('api/get_friends.php?status=accepted');
            const data = await response.json();

            if (data.success) {
                displayFriends(data.friends);
            } else {
                console.error('Error fetching friends:', data.message);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    // Function to display friends
    const displayFriends = (friends) => {
        if (!friendList) return;

        friendList.innerHTML = ''; // Clear existing list

        if (friends.length === 0) {
            friendList.innerHTML = '<p>No friends yet.</p>';
            return;
        }

        friends.forEach(friend => {
            const listItem = document.createElement('li');
            listItem.textContent = friend.username;
            friendList.appendChild(listItem);
        });
    };

    // Initial fetch of friend requests and friends on page load
    fetchFriendRequests();
    fetchFriends();
});