<?php
header('Content-Type: application/json');
require_once 'config.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['status' => 'error', 'message' => 'Not logged in']);
    exit;
}

$user_id1 = $_SESSION['user_id'];

if (!isset($_POST['user_id2'])) {
    echo json_encode(['status' => 'error', 'message' => 'Missing user_id2']);
    exit;
}

$user_id2 = $_POST['user_id2'];

if ($user_id1 == $user_id2) {
    echo json_encode(['status' => 'error', 'message' => 'Cannot send friend request to yourself']);
    exit;
}

$sql = "SELECT * FROM friendships WHERE (user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iiii", $user_id1, $user_id2, $user_id2, $user_id1);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $friendship = $result->fetch_assoc();
    if ($friendship['status'] == 'pending') {
        echo json_encode(['status' => 'error', 'message' => 'Friend request already pending']);
    } elseif ($friendship['status'] == 'accepted') {
        echo json_encode(['status' => 'error', 'message' => 'Already friends']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Friend request already rejected']);
    }
    exit;
}

$sql = "INSERT INTO friendships (user_id1, user_id2) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $user_id1, $user_id2);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Friend request sent']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Failed to send friend request']);
}

$stmt->close();
$conn->close();
?>