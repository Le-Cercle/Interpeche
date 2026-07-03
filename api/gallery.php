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
            SELECT id, title, image_url, alt_text, category, position
            FROM   gallery_items
            WHERE  ' . implode(' AND ', $where) . '
            ORDER  BY category, position
        ');
        $stmt->execute($params);
        json_ok($stmt->fetchAll());

    case 'POST':
        $user = require_auth();
        $data = get_body();
        validate(['title', 'image_url', 'category'], $data);
        $db->prepare('
            INSERT INTO gallery_items (title, image_url, image_file_id, alt_text, category, position, published, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ')->execute([
            $data['title'],
            $data['image_url'],
            $data['image_file_id'] ?? null,
            $data['alt_text']      ?? null,
            $data['category'],
            (int)($data['position'] ?? 0),
            (int)($data['published'] ?? 1),
            $user['user_id'],
        ]);
        $newId = (int)$db->lastInsertId();
        log_action('gallery.create', 'gallery', $newId, null, $data, $user['user_id']);
        json_ok(['id' => $newId], 201);

    case 'PUT':
        if (!$id) json_error('ID requis', 400);
        $user = require_auth();
        $data = get_body();
        $stmt = $db->prepare('SELECT * FROM gallery_items WHERE id = ? AND deleted_at IS NULL');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) json_error('Élément introuvable', 404);
        $allowed = ['title', 'image_url', 'image_file_id', 'alt_text', 'category', 'position', 'published'];
        $sets = []; $params = [];
        foreach ($allowed as $f) {
            if (!array_key_exists($f, $data)) continue;
            $sets[] = "`$f` = ?"; $params[] = $data[$f];
        }
        if (empty($sets)) json_error('Aucun champ à modifier', 400);
        $params[] = $id;
        $db->prepare('UPDATE gallery_items SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($params);
        log_action('gallery.update', 'gallery', $id, null, $data, $user['user_id']);
        json_ok(['updated' => true]);

    case 'DELETE':
        if (!$id) json_error('ID requis', 400);
        $user = require_auth();
        $db->prepare('UPDATE gallery_items SET deleted_at = NOW() WHERE id = ?')->execute([$id]);
        log_action('gallery.delete', 'gallery', $id, null, null, $user['user_id']);
        json_ok(null, 204);

    default:
        json_error('Méthode non autorisée', 405);
}
