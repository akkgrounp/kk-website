<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/functions.php';

function kk_db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    try {
        $pdo = new PDO(
            sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', DB_HOST, DB_NAME),
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        );
        kk_bootstrap_schema($pdo);
        return $pdo;
    } catch (Throwable $exception) {
        http_response_code(500);
        echo '<h1>Database connection failed</h1>';
        echo '<p>Please edit <code>includes/config.php</code> with the correct MySQL database name, user and password from cPanel.</p>';
        echo '<pre>' . kk_e($exception->getMessage()) . '</pre>';
        exit;
    }
}
