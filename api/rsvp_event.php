<?php
header('Content-Type: application/json');
require_once 'config.php';

// Check if the user is logged in (e.g., via session or token)
session_start();
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $event_id = isset($_POST['event_id']) ? intval($_POST['event_id']) : 0;
    $rsvp_status = isset($_POST['rsvp_status']) ? $_POST['rsvp_status'] : '';

    // Validate data
    if ($event_id <= 0 || !in_array($rsvp_status, ['going', 'interested', 'not_going'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Invalid data']);
        exit;
    }

    try {
        // Check if the user is already attending the event
        $stmt = $pdo->prepare("SELECT id FROM event_attendees WHERE event_id = :event_id AND user_id = :user_id");
        $stmt->execute(['event_id' => $event_id, 'user_id' => $user_id]);
        $existing_attendance = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($existing_attendance) {
            // Update existing RSVP status
            $stmt = $pdo->prepare("UPDATE event_attendees SET rsvp_status = :rsvp_status WHERE id = :id");
            $stmt->execute(['rsvp_status' => $rsvp_status, 'id' => $existing_attendance['id']]);
        } else {
            // Insert new RSVP
            $stmt = $pdo->prepare("INSERT INTO event_attendees (event_id, user_id, rsvp_status) VALUES (:event_id, :user_id, :rsvp_status)");
            $stmt->execute(['event_id' => $event_id, 'user_id' => $user_id, 'rsvp_status' => $rsvp_status]);
        }

        echo json_encode(['message' => 'RSVP updated successfully']);

    } catch (PDOException $e) {
        http_response_code(500);
        error_log("PDO Exception: " . $e->getMessage());
        echo json_encode(['message' => 'Database error']);
    }

} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>