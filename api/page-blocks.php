<?php
require_once __DIR__ . '/helpers.php';
init();

$method   = $_SERVER['REQUEST_METHOD'];
$id       = isset($_GET['id'])   ? (int)$_GET['id']  : null;
$page_key = $_GET['page'] ?? null;
$db       = get_db();

switch ($method) {

    case 'GET':
        if (!$page_key) json_error('Paramètre page requis', 400);
        $stmt = $db->prepare('
            SELECT id, page_key, block_key, page_name, title, content, extra_data, position, published
            FROM   page_blocks
            WHERE  page_key = ? AND deleted_at IS NULL AND published = 1
            ORDER  BY position
        ');
        $stmt->execute([$page_key]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$row) {
            if ($row['extra_data']) $row['extra_data'] = json_decode($row['extra_data'], true);
        }
        json_ok($rows);

    case 'PUT':
        if (!$id) json_error('ID requis', 400);
        $user = require_auth();
        $data = get_body();

        $stmt = $db->prepare('SELECT id FROM page_blocks WHERE id = ? AND deleted_at IS NULL');
        $stmt->execute([$id]);
        if (!$stmt->fetch()) json_error('Bloc introuvable', 404);

        $allowed = ['title', 'content', 'extra_data', 'position', 'published'];
        $sets = []; $params = [];
        foreach ($allowed as $f) {
            if (!array_key_exists($f, $data)) continue;
            $sets[]   = "`$f` = ?";
            $params[] = ($f === 'extra_data' && is_array($data[$f]))
                ? json_encode($data[$f], JSON_UNESCAPED_UNICODE)
                : $data[$f];
        }
        $sets[]   = 'updated_by = ?';
        $params[] = $user['user_id'];
        $params[] = $id;

        $db->prepare('UPDATE page_blocks SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($params);
        log_action('page_block.update', 'page_block', $id, null, $data, $user['user_id']);
        json_ok(['updated' => true]);

    default:
        json_error('Méthode non autorisée', 405);
}
