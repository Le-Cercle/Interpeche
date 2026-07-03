<?php
require_once __DIR__ . '/helpers.php';
init();

$method = $_SERVER['REQUEST_METHOD'];
$key    = $_GET['key'] ?? null;
$db     = get_db();

switch ($method) {

    case 'GET':
        if ($key) {
            $stmt = $db->prepare('SELECT config_value FROM site_config WHERE config_key = ?');
            $stmt->execute([$key]);
            $row = $stmt->fetch();
            if (!$row) json_error("Clé '$key' introuvable", 404);
            json_ok(json_decode($row['config_value'], true));
        }
        // Toutes les clés
        $stmt = $db->query('SELECT config_key, config_value FROM site_config ORDER BY config_key');
        $result = [];
        foreach ($stmt->fetchAll() as $row) {
            $result[$row['config_key']] = json_decode($row['config_value'], true);
        }
        json_ok($result);

    case 'PUT':
        if (!$key) json_error('Paramètre key requis', 400);
        $user = require_auth();
        $data = get_body();

        $stmt = $db->prepare('SELECT config_value FROM site_config WHERE config_key = ?');
        $stmt->execute([$key]);
        $before = $stmt->fetch();

        $db->prepare('
            INSERT INTO site_config (config_key, config_value, updated_by)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE config_value = VALUES(config_value), updated_by = VALUES(updated_by)
        ')->execute([$key, json_encode($data, JSON_UNESCAPED_UNICODE), $user['user_id']]);

        log_action("config.$key.update", 'config', null, $before ? json_decode($before['config_value'], true) : null, $data, $user['user_id']);
        json_ok(['updated' => true]);

    default:
        json_error('Méthode non autorisée', 405);
}
