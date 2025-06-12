<?php
header('Content-Type: application/json');
session_start();

require_once 'config.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userId = $_SESSION['user_id'];
    $content = $_POST['content'] ?? '';
    $imageUrl = $_POST['image_url'] ?? null;

    if (empty($content) && empty($imageUrl)) {
        echo json_encode(['status' => 'error', 'message' => 'Post content cannot be empty']);
        exit;
    }

    try {
        $pdo = connectDB();
        $stmt = $pdo->prepare("INSERT INTO posts (user_id, content, image_url) VALUES (:user_id, :content, :image_url)");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->bindParam(':content', $content, PDO::PARAM_STR);
        $stmt->bindParam(':image_url', $imageUrl, PDO::PARAM_STR);
        $stmt->execute();

        echo json_encode(['status' => 'success', 'message' => 'Post created successfully']);

    } catch (PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>