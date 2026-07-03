<?php
require_once __DIR__ . '/helpers.php';
init();

$method = $_SERVER['REQUEST_METHOD'];
$db     = get_db();

switch ($method) {

    // POST /api/auth.php — Login
    case 'POST':
        $data = get_body();
        validate(['username', 'password'], $data);

        $stmt = $db->prepare('SELECT id, username, email, role, password_hash FROM users WHERE (username = ? OR email = ?) AND is_active = 1');
        $stmt->execute([$data['username'], $data['username']]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            json_error('Identifiants incorrects', 401);
        }

        // Générer un token aléatoire (64 hex chars)
        $token   = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+24 hours'));

        $db->prepare('
            INSERT INTO sessions (user_id, refresh_token, expires_at, ip_address, user_agent)
            VALUES (?, ?, ?, ?, ?)
        ')->execute([
            $user['id'],
            $token,
            $expires,
            $_SERVER['REMOTE_ADDR'] ?? null,
            substr($_SERVER['HTTP_USER_AGENT'] ?? '', 0, 500),
        ]);

        // Mettre à jour last_login_at
        $db->prepare('UPDATE users SET last_login_at = NOW() WHERE id = ?')->execute([$user['id']]);

        log_action('user.login', 'user', $user['id'], null, null, $user['id']);

        json_ok([
            'token'      => $token,
            'expires_at' => $expires,
            'user'       => [
                'id'       => $user['id'],
                'username' => $user['username'],
                'email'    => $user['email'],
                'role'     => $user['role'],
            ],
        ]);

    // GET /api/auth.php — Vérifier le token courant
    case 'GET':
        $user = require_auth();
        $stmt = $db->prepare('SELECT id, username, email, role, last_login_at FROM users WHERE id = ?');
        $stmt->execute([$user['user_id']]);
        json_ok($stmt->fetch());

    // DELETE /api/auth.php — Logout
    case 'DELETE':
        $user  = require_auth();
        $token = preg_replace('/^Bearer\s+/', '', getallheaders()['Authorization'] ?? '');
        $db->prepare('UPDATE sessions SET revoked_at = NOW(), revoked_reason = "logout" WHERE refresh_token = ?')
           ->execute([$token]);
        log_action('user.logout', 'user', $user['user_id'], null, null, $user['user_id']);
        json_ok(null, 204);

    default:
        json_error('Méthode non autorisée', 405);
}
