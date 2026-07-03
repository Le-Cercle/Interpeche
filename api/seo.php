<?php
require_once __DIR__ . '/helpers.php';
init();

$method = $_SERVER['REQUEST_METHOD'];
$key    = $_GET['key'] ?? null;
$db     = get_db();

switch ($method) {

    case 'GET':
        if ($key) {
            $stmt = $db->prepare('SELECT * FROM seo_pages WHERE page_key = ?');
            $stmt->execute([$key]);
            $row = $stmt->fetch();
            if (!$row) json_error("Page '$key' introuvable", 404);
            json_ok($row);
        }
        $stmt = $db->query('SELECT * FROM seo_pages ORDER BY page_key');
        $result = [];
        foreach ($stmt->fetchAll() as $row) {
            $result[$row['page_key']] = $row;
        }
        json_ok($result);

    case 'PUT':
        if (!$key) json_error('Paramètre key requis', 400);
        $user = require_auth();
        $data = get_body();
        validate(['title', 'description'], $data);

        $db->prepare('
            INSERT INTO seo_pages (page_key, title, description, og_image_url, canonical_url, og_type, updated_by)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              title = VALUES(title), description = VALUES(description),
              og_image_url = VALUES(og_image_url), canonical_url = VALUES(canonical_url),
              og_type = VALUES(og_type), updated_by = VALUES(updated_by)
        ')->execute([
            $key,
            $data['title'],
            $data['description'],
            $data['og_image_url']  ?? null,
            $data['canonical_url'] ?? null,
            $data['og_type']       ?? 'website',
            $user['user_id'],
        ]);
        log_action("seo.$key.update", 'seo', null, null, $data, $user['user_id']);
        json_ok(['updated' => true]);

    default:
        json_error('Méthode non autorisée', 405);
}
