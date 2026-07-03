<?php
require_once __DIR__ . '/helpers.php';
init();

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;
$db     = get_db();

switch ($method) {

    // Public — Envoyer un message
    case 'POST':
        $data = get_body();
        validate(['name', 'email', 'subject', 'message'], $data);

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            json_error('Adresse email invalide', 422);
        }

        // Rate-limiting : max 3 messages par IP par heure
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        if ($ip) {
            $check = $db->prepare('SELECT COUNT(*) FROM contact_messages WHERE ip_address = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)');
            $check->execute([$ip]);
            if ($check->fetchColumn() >= 3) {
                json_error('Trop de messages envoyés. Réessayez dans une heure.', 429);
            }
        }

        $db->prepare('
            INSERT INTO contact_messages (name, email, subject, message, ip_address)
            VALUES (?, ?, ?, ?, ?)
        ')->execute([
            strip_tags($data['name']),
            $data['email'],
            $data['subject'],
            strip_tags($data['message']),
            $ip ?: null,
        ]);
        json_ok(['sent' => true], 201);

    // Admin — Liste des messages
    case 'GET':
        require_auth();
        $status = $_GET['status'] ?? null;
        $where  = [];
        $params = [];
        if ($status) { $where[] = 'status = ?'; $params[] = $status; }
        $sql  = 'SELECT * FROM contact_messages' . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY created_at DESC';
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        json_ok($stmt->fetchAll());

    // Admin — Changer le statut d'un message
    case 'PUT':
        if (!$id) json_error('ID requis', 400);
        $user = require_auth();
        $data = get_body();
        $allowed = ['status', 'replied_at', 'replied_by', 'read_at'];
        $sets = []; $params = [];
        if (isset($data['status'])) {
            if ($data['status'] === 'read' && empty($data['read_at'])) {
                $sets[] = 'read_at = NOW()';
            }
            if ($data['status'] === 'replied') {
                $sets[] = 'replied_at = NOW()';
                $sets[] = 'replied_by = ' . (int)$user['user_id'];
            }
            $sets[]   = 'status = ?';
            $params[] = $data['status'];
        }
        if (empty($sets)) json_error('Aucun champ à modifier', 400);
        $params[] = $id;
        $db->prepare('UPDATE contact_messages SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($params);
        json_ok(['updated' => true]);

    default:
        json_error('Méthode non autorisée', 405);
}
