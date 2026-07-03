<?php
require_once __DIR__ . '/helpers.php';
init();

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;
$db     = get_db();

switch ($method) {

    case 'GET':
        $where  = ['deleted_at IS NULL', 'published = 1'];
        $params = [];
        if (!empty($_GET['category'])) {
            $where[]  = 'category = ?';
            $params[] = $_GET['category'];
        }
        $stmt = $db->prepare('
            SELECT id, title, youtube_id, embed_url, thumbnail_url, category, description, date_publication, position
            FROM   videos
            WHERE  ' . implode(' AND ', $where) . '
            ORDER  BY position, date_publication DESC
        ');
        $stmt->execute($params);
        json_ok($stmt->fetchAll());

    case 'POST':
        $user = require_auth();
        $data = get_body();
        validate(['title', 'category'], $data);
        $db->prepare('
            INSERT INTO videos (title, youtube_id, embed_url, thumbnail_url, thumbnail_file_id, category, description, date_publication, position, published, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ')->execute([
            $data['title'],
            $data['youtube_id']        ?? null,
            $data['embed_url']         ?? null,
            $data['thumbnail_url']     ?? null,
            $data['thumbnail_file_id'] ?? null,
            $data['category'],
            $data['description']       ?? null,
            $data['date_publication']  ?? null,
            (int)($data['position']    ?? 0),
            (int)($data['published']   ?? 1),
            $user['user_id'],
        ]);
        $newId = (int)$db->lastInsertId();
        log_action('video.create', 'video', $newId, null, $data, $user['user_id']);
        json_ok(['id' => $newId], 201);

    case 'PUT':
        if (!$id) json_error('ID requis', 400);
        $user = require_auth();
        $data = get_body();
        $stmt = $db->prepare('SELECT id FROM videos WHERE id = ? AND deleted_at IS NULL');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) json_error('Vidéo introuvable', 404);
        $allowed = ['title', 'youtube_id', 'embed_url', 'thumbnail_url', 'thumbnail_file_id', 'category', 'description', 'date_publication', 'position', 'published'];
        $sets = []; $params = [];
        foreach ($allowed as $f) {
            if (!array_key_exists($f, $data)) continue;
            $sets[] = "`$f` = ?"; $params[] = $data[$f];
        }
        if (empty($sets)) json_error('Aucun champ à modifier', 400);
        $params[] = $id;
        $db->prepare('UPDATE videos SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($params);
        log_action('video.update', 'video', $id, null, $data, $user['user_id']);
        json_ok(['updated' => true]);

    case 'DELETE':
        if (!$id) json_error('ID requis', 400);
        $user = require_auth();
        $db->prepare('UPDATE videos SET deleted_at = NOW() WHERE id = ?')->execute([$id]);
        log_action('video.delete', 'video', $id, null, null, $user['user_id']);
        json_ok(null, 204);

    default:
        json_error('Méthode non autorisée', 405);
}
