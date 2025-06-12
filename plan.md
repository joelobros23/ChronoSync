# Project Plan: ChronoSync

**Description:** A social networking platform designed to connect users through shared memories and planned future events, emphasizing temporal connections and collaborative experiences.


## Development Goals

- [ ] Set up the database schema in database.sql for users, posts, comments, friendships, events, and event attendees.
- [ ] Configure the database connection in api/config.php.
- [ ] Implement user registration functionality via api/register.php and register.html, with input validation and password hashing.
- [ ] Implement user login functionality via api/login.php and login.html, handling session management.
- [ ] Create a logout mechanism via api/logout.php and incorporate it into the frontend.
- [ ] Build the home page (home.html) with a post feed, allowing users to create and view posts.
- [ ] Develop api/create_post.php to handle new post submissions and store them in the database.
- [ ] Develop api/get_posts.php to retrieve posts from the database for the home page feed.
- [ ] Implement commenting functionality on posts using api/add_comment.php and api/get_comments.php.
- [ ] Create user profile pages (profile.html) displaying user information and their posts.
- [ ] Implement profile editing functionality (edit_profile.html and api/update_profile.php) to allow users to update their profile information and profile picture.
- [ ] Develop a friend request system using api/send_friend_request.php, api/accept_friend_request.php, and api/reject_friend_request.php.
- [ ] Create a friends list page (friends.html) showing a user's friends, and pending friend requests using api/get_friends.php.
- [ ] Implement event creation functionality using api/create_event.php and create_event.html, allowing users to schedule events.
- [ ] Develop an events page (events.html) displaying upcoming events based on user connections and interests using api/get_events.php.
- [ ] Create event detail pages (view_event.html) displaying event information and attendee lists using api/get_event_details.php.
- [ ] Implement event RSVP functionality using api/rsvp_event.php, allowing users to indicate their attendance status.
- [ ] Implement Tailwind CSS for styling across all pages, ensuring responsiveness and a consistent user interface.
- [ ] Write vanilla JavaScript in assets/js/main.js to handle client-side interactions for posts, comments, and the main feed.
- [ ] Write vanilla JavaScript in assets/js/auth.js to handle registration and login form submissions.
- [ ] Write vanilla JavaScript in assets/js/profile.js to manage profile display and updates.
- [ ] Write vanilla JavaScript in assets/js/friends.js to handle friend requests and friend list management.
- [ ] Write vanilla JavaScript in assets/js/events.js to handle event creation, display, and RSVP functionality.
- [ ] Configure .htaccess to enable URL rewriting for cleaner URLs (optional).
- [ ] Implement session management to maintain user authentication throughout the website.
