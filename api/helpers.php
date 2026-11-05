<?php
// CORS d'abord : sans en-têtes CORS, une erreur serveur (500) apparaît dans le
// navigateur comme une erreur CORS opaque et masque la vraie cause.
set_exception_handler(function (Throwable $e) {
    error_log('[interpeche-api] ' . $e);
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Erreur serveur']);
    exit;
});
set_cors();

if (!is_file(__DIR__ . '/db.php')) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => 'Configuration serveur incomplète : api/db.php est manquant']);
    exit;
}
require_once __DIR__ . '/db.php';

// ── CORS ───────────────────────────────────────────────────
function set_cors(): void {
    $allowed = [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://interpeche-ci.org',
        'https://www.interpeche-ci.org',
        'https://interpeche-ci.com',
        'https://www.interpeche-ci.com',
        'https://interpeche.vercel.app',
    ];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    // Origines supplémentaires via variable d'environnement (ex. previews Vercel), séparées par des virgules
    $extra = array_filter(array_map('trim', explode(',', getenv('CORS_EXTRA_ORIGINS') ?: '')));
    header('Vary: Origin');
    if (in_array($origin, array_merge($allowed, $extra), true)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Credentials: true');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

// ── Initialisation de chaque endpoint ──────────────────────
function init(): void {
    set_cors();
    header('Content-Type: application/json; charset=utf-8');
}

// ── Réponses JSON ──────────────────────────────────────────
function json_ok(mixed $data, int $code = 200): never {
    http_response_code($code);
    if ($code === 204 || $data === null) { exit; }
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error(string $message, int $code = 400): never {
    http_response_code($code);
    echo json_encode(['error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

// ── Corps de la requête ────────────────────────────────────
function get_body(): array {
    $raw = file_get_contents('php://input');
    if (empty($raw)) return [];
    $data = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        json_error('Corps JSON invalide', 400);
    }
    return $data;
}

// ── Validation des champs requis ───────────────────────────
function validate(array $required, array $data): void {
    foreach ($required as $field) {
        if (!isset($data[$field]) || $data[$field] === '') {
            json_error("Champ requis manquant : $field", 422);
        }
    }
}

// ── Authentification Bearer token ─────────────────────────
function require_auth(): array {
    $headers = getallheaders();
    $auth = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!preg_match('/^Bearer\s+(\S+)$/', $auth, $m)) {
        json_error('Authentification requise', 401);
    }
    $token = $m[1];
    $stmt = get_db()->prepare('
        SELECT s.id AS session_id, s.user_id, u.username, u.email, u.role
        FROM   sessions s
        JOIN   users    u ON u.id = s.user_id
        WHERE  s.refresh_token = ?
          AND  s.expires_at    > NOW()
          AND  s.revoked_at   IS NULL
          AND  u.is_active     = 1
    ');
    $stmt->execute([$token]);
    $user = $stmt->fetch();
    if (!$user) {
        json_error('Session invalide ou expirée', 401);
    }
    return $user;
}

// ── Génération de slug unique ──────────────────────────────
function make_slug(string $text, string $table = 'articles', string $col = 'slug'): string {
    $slug = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', iconv('UTF-8', 'ASCII//TRANSLIT', $text)), '-'));
    $base = $slug;
    $i    = 1;
    $db   = get_db();
    while (true) {
        $stmt = $db->prepare("SELECT id FROM `$table` WHERE `$col` = ?");
        $stmt->execute([$slug]);
        if (!$stmt->fetch()) break;
        $slug = $base . '-' . $i++;
    }
    return $slug;
}

// ── Journal d'audit ────────────────────────────────────────
function log_action(
    string $action,
    ?string $entity_type,
    int|null $entity_id,
    mixed $before,
    mixed $after,
    int $user_id,
    string $status = 'success'
): void {
    try {
        $details = ($before !== null || $after !== null)
            ? json_encode(['before' => $before, 'after' => $after], JSON_UNESCAPED_UNICODE)
            : null;
        get_db()->prepare('
            INSERT INTO activity_logs (user_id, action, status, entity_type, entity_id, details, ip_address)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ')->execute([
            $user_id,
            $action,
            $status,
            $entity_type,
            $entity_id,
            $details,
            $_SERVER['REMOTE_ADDR'] ?? null,
        ]);
    } catch (Throwable) {
        // Les erreurs de log ne doivent pas bloquer la requête principale
    }
}
