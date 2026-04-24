<?php
declare(strict_types=1);

require_once __DIR__ . '/functions.php';

if (!function_exists('kk_site_asset')) {
    function kk_site_asset(string $path): string
    {
        return '/php-assets/' . ltrim($path, '/');
    }
}

if (!function_exists('kk_page_url')) {
    function kk_page_url(string $page = 'home', array $params = []): string
    {
        $slug = (string) ($params['slug'] ?? '');

        switch ($page) {
            case 'home':
                return '/';
            case 'about':
                return '/about';
            case 'services':
                return '/services';
            case 'portfolio':
                return '/portfolio';
            case 'blog':
                return '/blog';
            case 'contact':
                return '/contact';
            case 'investor-login':
                return '/investor-login';
            case 'admin':
                return '/admin';
            case 'admin-logout':
                return '/admin/logout';
            case 'service':
                return '/service/' . rawurlencode($slug);
            default:
                return '/' . ltrim($page, '/');
        }
    }
}

if (!function_exists('kk_find_service')) {
    function kk_find_service(string $slug): ?array
    {
        global $kk_services;

        foreach ($kk_services as $service) {
            if (($service['slug'] ?? '') === $slug) {
                return $service;
            }
        }

        return null;
    }
}

function kk_render_head(string $title, string $description, string $bodyClass = ''): void
{
    ?>
    <!doctype html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="theme-color" content="#0b1c2d">
        <meta name="description" content="<?php echo kk_e($description); ?>">
        <title><?php echo kk_e($title); ?></title>
        <link rel="icon" href="<?php echo kk_e(kk_site_asset('logo.png')); ?>">
        <link rel="stylesheet" href="<?php echo kk_e(kk_site_asset('style.css')); ?>">
    </head>
    <body<?php echo $bodyClass !== '' ? ' class="' . kk_e($bodyClass) . '"' : ''; ?>>
    <?php
}

function kk_render_flash(): void
{
    $flash = kk_flash();
    if (!$flash) {
        return;
    }

    $type = in_array(($flash['type'] ?? ''), ['success', 'error', 'info'], true) ? $flash['type'] : 'info';
    $message = (string) ($flash['message'] ?? '');

    if ($message === '') {
        return;
    }
    ?>
    <div class="flash-wrap">
        <div class="container">
            <div class="flash-banner <?php echo kk_e($type); ?>"><?php echo kk_e($message); ?></div>
        </div>
    </div>
    <?php
}

function kk_render_header(string $currentPage = 'home'): void
{
    global $kk_services;
    $isAdmin = kk_is_admin();
    $whatsappDigits = kk_phone_digits(SITE_WHATSAPP);
    $whatsappHref = 'https://wa.me/' . $whatsappDigits . '?text=' . rawurlencode(SITE_WHATSAPP_TEXT);
    ?>
    <header class="site-header">
        <div class="topbar">
            <div class="container topbar-inner">
                <span>International Corporate Group</span>
                <span><a href="mailto:<?php echo kk_e(SITE_EMAIL); ?>"><?php echo kk_e(SITE_EMAIL); ?></a></span>
                <span><a href="tel:<?php echo kk_e(SITE_PHONE); ?>"><?php echo kk_e(SITE_PHONE); ?></a></span>
                <span>Secure | Transparent | Global</span>
            </div>
        </div>

        <div class="container nav-wrap">
            <a class="logo" href="<?php echo kk_e(kk_page_url('home')); ?>">
                <img src="<?php echo kk_e(kk_site_asset('logo.png')); ?>" alt="KK Group of Companies logo" class="logo-mark">
                <span class="logo-text">
                    <strong>KK Group</strong>
                    <em>of Companies</em>
                </span>
            </a>

            <button type="button" class="menu-btn" aria-label="Toggle navigation">Menu</button>

            <nav class="main-nav">
                <a class="<?php echo $currentPage === 'home' ? 'active' : ''; ?>" href="<?php echo kk_e(kk_page_url('home')); ?>">Home</a>
                <a class="<?php echo $currentPage === 'about' ? 'active' : ''; ?>" href="<?php echo kk_e(kk_page_url('about')); ?>">About</a>
                <div class="nav-dropdown <?php echo in_array($currentPage, ['services', 'service'], true) ? 'active' : ''; ?>">
                    <a href="<?php echo kk_e(kk_page_url('services')); ?>">Services</a>
                    <div class="nav-dropdown-menu">
                        <?php foreach ($kk_services as $service): ?>
                            <a href="<?php echo kk_e(kk_page_url('service', ['slug' => $service['slug']])); ?>"><?php echo kk_e($service['short']); ?></a>
                        <?php endforeach; ?>
                    </div>
                </div>
                <a class="<?php echo $currentPage === 'portfolio' ? 'active' : ''; ?>" href="<?php echo kk_e(kk_page_url('portfolio')); ?>">Portfolio</a>
                <a class="<?php echo $currentPage === 'blog' ? 'active' : ''; ?>" href="<?php echo kk_e(kk_page_url('blog')); ?>">Blog</a>
                <a class="<?php echo $currentPage === 'contact' ? 'active' : ''; ?>" href="<?php echo kk_e(kk_page_url('contact')); ?>">Contact</a>
                <?php if ($isAdmin): ?>
                    <a class="nav-cta <?php echo $currentPage === 'admin' ? 'active' : ''; ?>" href="<?php echo kk_e(kk_page_url('admin')); ?>">Admin Dashboard</a>
                    <a href="<?php echo kk_e(kk_page_url('admin-logout')); ?>">Logout</a>
                <?php else: ?>
                    <a class="nav-cta <?php echo $currentPage === 'investor-login' ? 'active' : ''; ?>" href="<?php echo kk_e(kk_page_url('investor-login')); ?>">Investor Login</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>
    <?php
}

function kk_render_footer(): void
{
    $year = (int) date('Y');
    $whatsappDigits = kk_phone_digits(SITE_WHATSAPP);
    $whatsappHref = 'https://wa.me/' . $whatsappDigits . '?text=' . rawurlencode(SITE_WHATSAPP_TEXT);
    ?>
    <footer class="footer">
        <div class="container footer-shell">
            <div class="footer-brand-row">
                <div class="footer-brand-lockup">
                    <img src="<?php echo kk_e(kk_site_asset('logo.png')); ?>" alt="KK Group of Companies logo">
                    <div>
                        <h3>KK Group of Companies</h3>
                        <p>Global Corporate Platform</p>
                    </div>
                </div>
                <button class="footer-badge" type="button">
                    <span>Get Started</span>
                </button>
            </div>

            <div class="footer-top">
                <div class="footer-links">
                    <h4>Insights</h4>
                    <ul>
                        <li><a href="<?php echo kk_e(kk_page_url('blog')); ?>">Corporate Blog</a></li>
                        <li><a href="<?php echo kk_e(kk_page_url('portfolio')); ?>">Case Studies</a></li>
                        <li><a href="<?php echo kk_e(kk_page_url('services')); ?>">Service Updates</a></li>
                        <li><a href="<?php echo kk_e(kk_page_url('investor-login')); ?>">Investor Updates</a></li>
                    </ul>
                </div>

                <div class="footer-links">
                    <h4>Company</h4>
                    <ul>
                        <li><a href="<?php echo kk_e(kk_page_url('about')); ?>">About Us</a></li>
                        <li><a href="<?php echo kk_e(kk_page_url('contact')); ?>">Contact</a></li>
                        <li><a href="<?php echo kk_e(kk_page_url('services')); ?>">Operations</a></li>
                        <li><a href="<?php echo kk_e(kk_page_url('portfolio')); ?>">Global Offices</a></li>
                    </ul>
                </div>

                <div class="footer-links">
                    <h4>What We Do</h4>
                    <ul>
                        <li><a href="<?php echo kk_e(kk_page_url('service', ['slug' => 'business-support'])); ?>">Business Support</a></li>
                        <li><a href="<?php echo kk_e(kk_page_url('service', ['slug' => 'cars-sale-purchase'])); ?>">Cars Trading</a></li>
                        <li><a href="<?php echo kk_e(kk_page_url('service', ['slug' => 'real-estate'])); ?>">Real Estate</a></li>
                        <li><a href="<?php echo kk_e(kk_page_url('service', ['slug' => 'it-digital-services'])); ?>">IT & Digital</a></li>
                    </ul>
                </div>

                <aside class="footer-contact">
                    <div class="footer-newsletter">
                        <h4>Subscribe to our newsletter</h4>
                        <form method="post" action="<?php echo kk_e(kk_current_uri()); ?>">
                            <input type="hidden" name="form_type" value="newsletter">
                            <input type="email" name="email" placeholder="E-mail" aria-label="Email address" required>
                            <button type="submit" aria-label="Subscribe">&gt;</button>
                        </form>
                    </div>

                    <div class="footer-contact-list">
                        <h4>Contact Us</h4>
                        <p><strong>Email:</strong> <a href="mailto:<?php echo kk_e(SITE_EMAIL); ?>"><?php echo kk_e(SITE_EMAIL); ?></a></p>
                        <p><strong>Phone:</strong> <a href="tel:<?php echo kk_e(SITE_PHONE); ?>"><?php echo kk_e(SITE_PHONE); ?></a></p>
                        <p><strong>Offices:</strong> Spain | UAE | UK | Pakistan</p>
                    </div>
                </aside>
            </div>

            <div class="footer-social-bar">
                <div class="social-list">
                    <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer"><span>IN</span> LinkedIn</a>
                    <a href="https://www.facebook.com/" target="_blank" rel="noreferrer"><span>FB</span> Facebook</a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><span>IG</span> Instagram</a>
                    <a href="https://www.youtube.com/" target="_blank" rel="noreferrer"><span>YT</span> YouTube</a>
                    <a href="<?php echo kk_e($whatsappHref); ?>" target="_blank" rel="noreferrer"><span>WA</span> WhatsApp</a>
                </div>
                <span class="footer-copy">Copyright <?php echo $year; ?> KK Group of Companies. All rights reserved.</span>
            </div>
        </div>

        <div class="floating-stack">
            <a class="floating-btn live-chat" href="<?php echo kk_e(kk_page_url('contact')); ?>">Live Chat</a>
            <a class="floating-btn whatsapp" href="<?php echo kk_e($whatsappHref); ?>" target="_blank" rel="noreferrer">WhatsApp</a>
        </div>

        <script src="<?php echo kk_e(kk_site_asset('script.js')); ?>" defer></script>
    </footer>
    </body>
    </html>
    <?php
}
