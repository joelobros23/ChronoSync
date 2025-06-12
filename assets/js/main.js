/* Content for assets/js/main.js */

document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch and display posts
    function fetchPosts() {
        fetch('api/get_posts.php')
            .then(response => response.json())
            .then(posts => {
                const feedContainer = document.getElementById('feed-container');
                if (feedContainer) {
                    feedContainer.innerHTML = ''; // Clear existing posts
                    posts.forEach(post => {
                        const postElement = createPostElement(post);
                        feedContainer.appendChild(postElement);
                    });
                }
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    // Function to create a single post element
    function createPostElement(post) {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.dataset.postId = post.id; // Store post ID

        const postHeader = document.createElement('div');
        postHeader.classList.add('post-header');
        postHeader.innerHTML = `<strong>User ID: ${post.user_id}</strong> - ${post.created_at}`;
        postDiv.appendChild(postHeader);

        const postContent = document.createElement('div');
        postContent.classList.add('post-content');
        postContent.innerHTML = `<p>${post.content}</p>`;
        if (post.image_url) {
            postContent.innerHTML += `<img src="${post.image_url}" alt="Post Image" style="max-width: 100%;">`;
        }
        postDiv.appendChild(postContent);

        const commentSection = document.createElement('div');
        commentSection.classList.add('comment-section');
        commentSection.innerHTML = `<h4>Comments</h4><div class="comments-container" data-post-id="${post.id}"></div><textarea placeholder="Write a comment" class="comment-input"></textarea><button class="add-comment-button">Add Comment</button>`;
        postDiv.appendChild(commentSection);

        // Attach event listener to the "Add Comment" button
        const addCommentButton = commentSection.querySelector('.add-comment-button');
        addCommentButton.addEventListener('click', () => {
            const commentInput = commentSection.querySelector('.comment-input');
            const commentText = commentInput.value;
            if (commentText.trim() !== '') {
                addComment(post.id, commentText);
                commentInput.value = ''; // Clear the input
            }
        });


        // Load comments for the post
        loadComments(post.id, commentSection.querySelector('.comments-container'));

        return postDiv;
    }

    // Function to add a comment to a post
    function addComment(postId, content) {
        const formData = new FormData();
        formData.append('post_id', postId);
        formData.append('content', content);

        fetch('api/add_comment.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Reload comments after adding a new one
                const postDiv = document.querySelector(`.post[data-post-id="${postId}"]`);
                if (postDiv) {
                    const commentsContainer = postDiv.querySelector('.comments-container');
                    loadComments(postId, commentsContainer);
                }
            } else {
                console.error('Error adding comment:', data.message);
            }
        })
        .catch(error => console.error('Error adding comment:', error));
    }


    // Function to load comments for a specific post
    function loadComments(postId, commentsContainer) {
        fetch(`api/get_comments.php?post_id=${postId}`)
            .then(response => response.json())
            .then(comments => {
                commentsContainer.innerHTML = ''; // Clear existing comments
                comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment');
                    commentElement.innerHTML = `<strong>User ID: ${comment.user_id}</strong>: ${comment.content} - ${comment.created_at}`;
                    commentsContainer.appendChild(commentElement);
                });
            })
            .catch(error => console.error('Error loading comments:', error));
    }

    // Function to handle post creation
    function setupPostCreation() {
        const postForm = document.getElementById('post-form');
        if (postForm) {
            postForm.addEventListener('submit', function(event) {
                event.preventDefault();

                const content = document.getElementById('post-content').value;
                const image = document.getElementById('post-image').files[0];

                const formData = new FormData();
                formData.append('content', content);
                if (image) {
                    formData.append('image', image);
                }

                fetch('api/create_post.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Refresh the post feed
                        fetchPosts();
                        // Clear the form
                        document.getElementById('post-content').value = '';
                        document.getElementById('post-image').value = null;
                    } else {
                        console.error('Error creating post:', data.message);
                    }
                })
                .catch(error => console.error('Error creating post:', error));
            });
        }
    }

    // Initial fetch of posts
    fetchPosts();
    // Setup post creation form
    setupPostCreation();
});