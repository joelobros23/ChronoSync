<?php
header('Content-Type: application/json');

require_once 'config.php';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

try {
    // Fetch posts, ordered by creation date descending
    $stmt = $pdo->prepare("SELECT posts.*, users.username, users.profile_picture 
                            FROM posts 
                            INNER JOIN users ON posts.user_id = users.id 
                            ORDER BY posts.created_at DESC");
    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['status' => 'success', 'posts' => $posts]);

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error fetching posts: ' . $e->getMessage()]);
}
?>