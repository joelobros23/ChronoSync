<?php
header('Content-Type: application/json');
require_once 'config.php';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the post ID, user ID, and comment content from the request body
    $postId = isset($_POST['postId']) ? intval($_POST['postId']) : 0;
    $userId = isset($_POST['userId']) ? intval($_POST['userId']) : 0;
    $content = isset($_POST['content']) ? trim($_POST['content']) : '';

    // Validate the data
    if ($postId <= 0 || $userId <= 0 || empty($content)) {
        echo json_encode(['success' => false, 'message' => 'Invalid input data.']);
        exit;
    }

    // Sanitize the comment content (basic example, consider using more robust sanitization)
    $content = htmlspecialchars($content, ENT_QUOTES, 'UTF-8');

    // Insert the comment into the database
    $sql = "INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("iis", $postId, $userId, $content);
        if ($stmt->execute()) {
            // Comment added successfully
            echo json_encode(['success' => true, 'message' => 'Comment added successfully.']);
        } else {
            // Error adding comment
            echo json_encode(['success' => false, 'message' => 'Error adding comment: ' . $stmt->error]);
        }
        $stmt->close();
    } else {
        // Error preparing statement
        echo json_encode(['success' => false, 'message' => 'Error preparing statement: ' . $conn->error]);
    }

    $conn->close();

} else {
    // If the request method is not POST, return an error
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>