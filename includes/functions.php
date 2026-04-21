<?php
declare(strict_types=1);

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_start();
}

function kk_e(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function kk_url(string $path = ''): string
{
    $path = '/' . ltrim($path, '/');
    return $path === '//' ? '/' : $path;
}

function kk_current_uri(): string
{
    return $_SERVER['REQUEST_URI'] ?? '/';
}

function kk_redirect(string $path): void
{
    header('Location: ' . $path);
    exit;
}

function kk_is_post(string $formType): bool
{
    return ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && (($_POST['form_type'] ?? '') === $formType);
}

function kk_flash(string $type = '', ?string $message = null): ?array
{
    if ($message === null) {
        $flash = $_SESSION['kk_flash'] ?? null;
        unset($_SESSION['kk_flash']);
        return is_array($flash) ? $flash : null;
    }

    $_SESSION['kk_flash'] = [
        'type' => $type,
        'message' => $message,
    ];

    return null;
}

function kk_is_admin(): bool
{
    return !empty($_SESSION['kk_admin']);
}

function kk_is_investor(): bool
{
    return !empty($_SESSION['kk_investor']);
}

function kk_admin_name(): string
{
    return (string) ($_SESSION['kk_admin']['name'] ?? ADMIN_NAME);
}

function kk_phone_digits(string $phone): string
{
    return preg_replace('/[^0-9]/', '', $phone) ?: '';
}
function kk_bootstrap_schema(PDO $pdo): void
{
    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS kk_admins (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            email VARCHAR(190) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS kk_contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            email VARCHAR(190) NOT NULL,
            phone VARCHAR(60) DEFAULT NULL,
            subject VARCHAR(190) DEFAULT NULL,
            service_type VARCHAR(190) DEFAULT NULL,
            message TEXT NOT NULL,
            source_page VARCHAR(190) DEFAULT NULL,
            status VARCHAR(20) NOT NULL DEFAULT "new",
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS kk_newsletters (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(190) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
    );

    $pdo->exec(
        'CREATE TABLE IF NOT EXISTS kk_investor_accounts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(120) NOT NULL,
            email VARCHAR(190) NOT NULL UNIQUE,
            phone VARCHAR(60) NOT NULL,
            country VARCHAR(120) DEFAULT NULL,
            investment_amount DECIMAL(15,2) DEFAULT 0,
            password_hash VARCHAR(255) NOT NULL,
            status VARCHAR(20) NOT NULL DEFAULT "pending",
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4'
    );

    $count = (int) $pdo->query('SELECT COUNT(*) FROM kk_admins')->fetchColumn();
    if ($count === 0) {
        $stmt = $pdo->prepare('INSERT INTO kk_admins (name, email, password_hash) VALUES (?, ?, ?)');
        $stmt->execute([
            ADMIN_NAME,
            ADMIN_EMAIL,
            password_hash(ADMIN_PASSWORD, PASSWORD_DEFAULT),
        ]);
    }
}




