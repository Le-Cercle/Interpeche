<?php
require_once __DIR__ . '/helpers.php';
init();

$method = $_SERVER['REQUEST_METHOD'];
$db     = get_db();

switch ($method) {

    // Public — S'abonner
    case 'POST':
        $data = get_body();
        validate(['email'], $data);
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            json_error('Adresse email invalide', 422);
        }

        $email  = strtolower(trim($data['email']));
        $source = $data['source'] ?? 'homepage';

        // Vérifier si déjà inscrit
        $stmt = $db->prepare('SELECT id, status FROM newsletter_subscriptions WHERE email = ?');
        $stmt->execute([$email]);
        $existing = $stmt->fetch();

        if ($existing) {
            if ($existing['status'] === 'active') {
                json_ok(['status' => 'already_subscribed']);
            }
            // Réactiver
            $db->prepare('UPDATE newsletter_subscriptions SET status = "active", unsubscribed_at = NULL WHERE id = ?')
               ->execute([$existing['id']]);
            json_ok(['status' => 'resubscribed']);
        }

        $unsubToken    = bin2hex(random_bytes(32));
        $confirmToken  = bin2hex(random_bytes(32));

        $db->prepare('
            INSERT INTO newsletter_subscriptions (email, status, source, confirmation_token, unsubscribe_token)
            VALUES (?, "pending", ?, ?, ?)
        ')->execute([$email, $source, $confirmToken, $unsubToken]);

        // TODO: envoyer un email de confirmation avec $confirmToken
        json_ok(['status' => 'pending_confirmation'], 201);

    // Public — Se désabonner via token
    case 'DELETE':
        $token = $_GET['token'] ?? '';
        if (!$token) json_error('Token requis', 400);
        $stmt = $db->prepare('SELECT id FROM newsletter_subscriptions WHERE unsubscribe_token = ?');
        $stmt->execute([$token]);
        $row = $stmt->fetch();
        if (!$row) json_error('Token invalide', 404);
        $db->prepare('UPDATE newsletter_subscriptions SET status = "unsubscribed", unsubscribed_at = NOW() WHERE id = ?')
           ->execute([$row['id']]);
        json_ok(['status' => 'unsubscribed']);

    // Admin — Liste des abonnés
    case 'GET':
        require_auth();
        $status = $_GET['status'] ?? 'active';
        $stmt   = $db->prepare('SELECT id, email, status, source, confirmed_at, subscribed_at FROM newsletter_subscriptions WHERE status = ? ORDER BY subscribed_at DESC');
        $stmt->execute([$status]);
        json_ok($stmt->fetchAll());

    default:
        json_error('Méthode non autorisée', 405);
}
