<?php
require_once __DIR__ . '/helpers.php';
init();

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id']) ? (int)$_GET['id'] : null;
$slug   = $_GET['slug'] ?? null;
$db     = get_db();

switch ($method) {

    case 'GET':
        if ($id || $slug) {
            // Article unique
            if ($id) {
                $stmt = $db->prepare('SELECT * FROM articles WHERE id = ? AND deleted_at IS NULL');
                $stmt->execute([$id]);
            } else {
                $stmt = $db->prepare('SELECT * FROM articles WHERE slug = ? AND deleted_at IS NULL AND published = 1');
                $stmt->execute([$slug]);
            }
            $article = $stmt->fetch();
            if (!$article) json_error('Article introuvable', 404);
            // Décoder titre_style si présent
            if ($article['titre_style']) {
                $article['titre_style'] = json_decode($article['titre_style'], true);
            }
            json_ok($article);
        }

        // Liste avec filtres
        $where  = ['deleted_at IS NULL'];
        $params = [];

        // Admin peut voir les non-publiés
        $isAdmin = false;
        $headers = getallheaders();
        $auth    = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (preg_match('/^Bearer\s+(\S+)$/', $auth, $m)) {
            $check = $db->prepare('SELECT 1 FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.refresh_token = ? AND s.expires_at > NOW() AND s.revoked_at IS NULL AND u.is_active = 1');
            $check->execute([$m[1]]);
            $isAdmin = (bool)$check->fetch();
        }

        if (!$isAdmin) {
            $where[] = 'published = 1';
        } elseif (isset($_GET['published'])) {
            $where[]  = 'published = ?';
            $params[] = (int)$_GET['published'];
        }

        if (!empty($_GET['category'])) {
            $where[]  = 'categorie = ?';
            $params[] = $_GET['category'];
        }
        if (!empty($_GET['carousel'])) {
            $where[] = 'carousel = 1';
        }
        if (!empty($_GET['search'])) {
            $where[]  = 'MATCH(titre, description, contenu) AGAINST(? IN BOOLEAN MODE)';
            $params[] = trim($_GET['search']) . '*';
        }

        $limit  = min((int)($_GET['limit']  ?? 20), 100);
        $offset = (int)($_GET['offset'] ?? 0);
        $params[] = $limit;
        $params[] = $offset;

        $stmt = $db->prepare('
            SELECT id, slug, titre, description, categorie, date_publication,
                   image_url, auteur_nom, carousel, titre_style, published, created_at
            FROM   articles
            WHERE  ' . implode(' AND ', $where) . '
            ORDER  BY date_publication DESC
            LIMIT  ? OFFSET ?
        ');
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$row) {
            if ($row['titre_style']) $row['titre_style'] = json_decode($row['titre_style'], true);
        }
        json_ok($rows);

    case 'POST':
        $user = require_auth();
        $data = get_body();
        validate(['titre', 'description', 'categorie', 'date_publication'], $data);

        $slug = make_slug($data['titre']);
        $db->prepare('
            INSERT INTO articles
              (slug, titre, description, contenu, categorie, date_publication,
               image_url, image_file_id, auteur_nom, created_by, titre_style, carousel, published)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ')->execute([
            $slug,
            $data['titre'],
            $data['description'],
            $data['contenu']        ?? null,
            $data['categorie'],
            $data['date_publication'],
            $data['image_url']      ?? null,
            $data['image_file_id']  ?? null,
            $data['auteur_nom']     ?? 'Rédaction',
            $user['user_id'],
            isset($data['titre_style']) ? json_encode($data['titre_style']) : null,
            (int)($data['carousel']  ?? 0),
            (int)($data['published'] ?? 1),
        ]);
        $newId = (int)$db->lastInsertId();
        log_action('article.create', 'article', $newId, null, $data, $user['user_id']);
        json_ok(['id' => $newId, 'slug' => $slug], 201);

    case 'PUT':
        if (!$id) json_error('ID requis', 400);
        $user = require_auth();
        $data = get_body();

        $stmt = $db->prepare('SELECT * FROM articles WHERE id = ? AND deleted_at IS NULL');
        $stmt->execute([$id]);
        $before = $stmt->fetch();
        if (!$before) json_error('Article introuvable', 404);

        $allowed = ['slug', 'titre', 'description', 'contenu', 'categorie', 'date_publication',
                    'image_url', 'image_file_id', 'auteur_nom', 'titre_style', 'carousel', 'published'];
        $sets   = [];
        $params = [];
        foreach ($allowed as $f) {
            if (!array_key_exists($f, $data)) continue;
            $sets[]   = "`$f` = ?";
            $params[] = ($f === 'titre_style' && is_array($data[$f]))
                ? json_encode($data[$f])
                : $data[$f];
        }
        if (empty($sets)) json_error('Aucun champ à modifier', 400);
        $params[] = $id;
        $db->prepare('UPDATE articles SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($params);
        log_action('article.update', 'article', $id, $before, $data, $user['user_id']);
        json_ok(['updated' => true]);

    case 'DELETE':
        if (!$id) json_error('ID requis', 400);
        $user = require_auth();
        $db->prepare('UPDATE articles SET deleted_at = NOW() WHERE id = ?')->execute([$id]);
        log_action('article.delete', 'article', $id, null, null, $user['user_id']);
        json_ok(null, 204);

    default:
        json_error('Méthode non autorisée', 405);
}
