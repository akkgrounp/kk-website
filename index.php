<?php
declare(strict_types=1);

require_once __DIR__ . '/includes/config.php';
require_once __DIR__ . '/includes/functions.php';
require_once __DIR__ . '/includes/data.php';
require_once __DIR__ . '/includes/layout.php';

function kk_db_connection(): PDO
{
    require_once __DIR__ . '/includes/db.php';
    return kk_db();
}

function kk_request_path(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $path = rtrim($path, '/');
    return $path === '' ? '/' : $path;
}

function kk_input(string $key, string $default = ''): string
{
    return trim((string) ($_POST[$key] ?? $default));
}

function kk_redirect_with_flash(string $type, string $message, string $target): void
{
    kk_flash($type, $message);
    kk_redirect($target);
}

function kk_safe_status(string $status, array $allowed, string $fallback = 'pending'): string
{
    return in_array($status, $allowed, true) ? $status : $fallback;
}

function kk_amount(string $value): string
{
    $value = preg_replace('/[^0-9.]/', '', $value) ?: '0';
    return $value;
}

function kk_grab_contacts(PDO $pdo, int $limit = 12): array
{
    $stmt = $pdo->prepare('SELECT * FROM kk_contacts ORDER BY created_at DESC, id DESC LIMIT ' . max(1, $limit));
    $stmt->execute();
    return $stmt->fetchAll();
}

function kk_grab_investors(PDO $pdo, int $limit = 12): array
{
    $stmt = $pdo->prepare('SELECT * FROM kk_investor_accounts ORDER BY created_at DESC, id DESC LIMIT ' . max(1, $limit));
    $stmt->execute();
    return $stmt->fetchAll();
}

function kk_grab_newsletters(PDO $pdo, int $limit = 12): array
{
    $stmt = $pdo->prepare('SELECT * FROM kk_newsletters ORDER BY created_at DESC, id DESC LIMIT ' . max(1, $limit));
    $stmt->execute();
    return $stmt->fetchAll();
}

function kk_admin_stats(PDO $pdo): array
{
    return [
        'contacts_total' => (int) $pdo->query('SELECT COUNT(*) FROM kk_contacts')->fetchColumn(),
        'contacts_new' => (int) $pdo->query("SELECT COUNT(*) FROM kk_contacts WHERE status = 'new'")->fetchColumn(),
        'newsletters_total' => (int) $pdo->query('SELECT COUNT(*) FROM kk_newsletters')->fetchColumn(),
        'investors_total' => (int) $pdo->query('SELECT COUNT(*) FROM kk_investor_accounts')->fetchColumn(),
        'investors_pending' => (int) $pdo->query("SELECT COUNT(*) FROM kk_investor_accounts WHERE status = 'pending'")->fetchColumn(),
        'investors_approved' => (int) $pdo->query("SELECT COUNT(*) FROM kk_investor_accounts WHERE status = 'approved'")->fetchColumn(),
        'investors_rejected' => (int) $pdo->query("SELECT COUNT(*) FROM kk_investor_accounts WHERE status = 'rejected'")->fetchColumn(),
    ];
}

function kk_status_badge(string $status): string
{
    $status = strtolower($status);
    $label = ucfirst($status);
    return '<span class="status-pill ' . kk_e($status) . '">' . kk_e($label) . '</span>';
}

function kk_render_service_cards(): void
{
    global $kk_services;
    echo '<div class="grid grid-4">';
    foreach ($kk_services as $service) {
        echo '<article class="service-card">';
        echo '<span class="service-icon">' . kk_e((string) $service['icon']) . '</span>';
        echo '<h3>' . kk_e((string) $service['name']) . '</h3>';
        echo '<p>' . kk_e((string) $service['summary']) . '</p>';
        echo '<a class="button button-outline" href="' . kk_e(kk_page_url('service', ['slug' => (string) $service['slug']])) . '">View Details</a>';
        echo '</article>';
    }
    echo '</div>';
}

function kk_render_card_grid(array $items): void
{
    echo '<div class="grid grid-3">';
    foreach ($items as $item) {
        $title = (string) ($item['title'] ?? $item['name'] ?? '');
        $text = (string) ($item['excerpt'] ?? $item['intro'] ?? $item['summary'] ?? '');
        $image = (string) ($item['image'] ?? '');
        $category = (string) ($item['category'] ?? '');
        $readTime = (string) ($item['readTime'] ?? '');
        $slug = (string) ($item['slug'] ?? '');
        echo '<article class="card media-card">';
        echo '<div class="media-thumb"><img src="' . kk_e($image) . '" alt="' . kk_e($title) . '"></div>';
        echo '<div class="card-body">';
        if ($category !== '') {
            echo '<span class="eyebrow">' . kk_e($category) . '</span>';
        }
        echo '<h3>' . kk_e($title) . '</h3>';
        if ($text !== '') {
            echo '<p>' . kk_e($text) . '</p>';
        }
        if ($readTime !== '') {
            echo '<p class="meta-line">' . kk_e($readTime) . '</p>';
        }
        if ($slug !== '') {
            echo '<a class="button button-outline" href="' . kk_e(kk_page_url('service', ['slug' => $slug])) . '">View Details</a>';
        }
        echo '</div></article>';
    }
    echo '</div>';
}

function kk_render_home(): void
{
    global $kk_countries, $kk_home_stats, $kk_why_choose, $kk_leadership_stats;
    ?>
    <main>
        <section class="hero-section">
            <div class="container hero-grid">
                <div class="hero-copy">
                    <span class="eyebrow">International Corporate Group</span>
                    <h1>One Global Company – Complete Business Solutions Worldwide</h1>
                    <p>We provide international business support, real estate, automobiles, IT solutions and investment services under one platform.</p>
                    <div class="hero-actions">
                        <a class="button" href="<?php echo kk_e(kk_page_url('services')); ?>">Explore Services</a>
                        <a class="button button-outline" href="<?php echo kk_e(kk_page_url('investor-login')); ?>">Become an Investor</a>
                        <a class="button button-ghost" href="<?php echo kk_e(kk_page_url('contact')); ?>">Get Consultation</a>
                    </div>
                    <div class="pill-row">
                        <span>Trusted by cross-border clients</span>
                        <span>Transparent investment model</span>
                        <span>Secure agreements</span>
                    </div>
                </div>
                <div class="hero-panel">
                    <div class="hero-visual">
                        <div class="hero-visual-top"></div>
                        <img src="<?php echo kk_e(kk_site_asset('seo.png')); ?>" alt="CEO of KK Group" class="hero-ceo-image">
                    </div>
                    <div class="hero-stat-grid">
                        <?php foreach ($kk_home_stats as $stat): ?>
                            <div class="stat-card">
                                <strong><?php echo kk_e((string) $stat['value']); ?></strong>
                                <span><?php echo kk_e((string) $stat['label']); ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">About KK Group</span>
                    <h2>Premium international operations with one unified corporate brand.</h2>
                    <p>We operate through focused business divisions, structured governance and long-term client partnerships.</p>
                </div>
                <div class="feature-band">
                    <div>
                        <h3>Global Presence</h3>
                        <p>Spain, UAE, UK, Pakistan and expanding international markets.</p>
                    </div>
                    <div>
                        <h3>Core Principles</h3>
                        <p>Integrity, clarity, compliance and investor-focused execution.</p>
                    </div>
                    <div>
                        <h3>Always Available</h3>
                        <p>Email: <?php echo kk_e(SITE_EMAIL); ?> | Phone: <?php echo kk_e(SITE_PHONE); ?></p>
                    </div>
                </div>
            </div>
        </section>

        <section class="section section-alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Our Services</span>
                    <h2>Built to support clients across business, trade, property and technology.</h2>
                </div>
                <?php kk_render_service_cards(); ?>
            </div>
        </section>

        <section class="section">
            <div class="container two-col">
                <div class="image-card">
                    <img src="<?php echo kk_e(kk_site_asset('seo.png')); ?>" alt="CEO portrait">
                </div>
                <div class="content-card">
                    <span class="eyebrow">SEO Leadership</span>
                    <h2>Meet our CEO, Mr. Kamran Ali Khan</h2>
                    <p>Mr. Kamran Ali Khan leads KK Group with a focused global vision, 10+ years of leadership and a disciplined approach to client growth.</p>
                    <p>We deliver international-standard business solutions, helping clients expand, trade and invest with confidence.</p>
                    <div class="mini-stat-grid">
                        <?php foreach ($kk_leadership_stats as $stat): ?>
                            <div class="mini-stat">
                                <strong><?php echo kk_e((string) $stat['value']); ?></strong>
                                <span><?php echo kk_e((string) $stat['label']); ?></span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    <div class="hero-actions">
                        <a class="button" href="<?php echo kk_e(kk_page_url('about')); ?>">Read Full About</a>
                        <a class="button button-outline" href="<?php echo kk_e(kk_page_url('contact')); ?>">Book Free Consultation</a>
                    </div>
                </div>
            </div>
        </section>

        <section class="section section-alt">
            <div class="container two-col two-col-reverse">
                <div class="content-card">
                    <span class="eyebrow">Why Choose Us</span>
                    <h2>Built for corporate reliability and long-term partnerships.</h2>
                    <ul class="tick-list">
                        <?php foreach ($kk_why_choose as $point): ?>
                            <li><?php echo kk_e($point); ?></li>
                        <?php endforeach; ?>
                    </ul>
                    <p class="muted">We keep business processes simple, professional and highly responsive for international clients.</p>
                </div>
                <div class="presence-card">
                    <span class="eyebrow">Global Presence</span>
                    <h3>Operating across international markets</h3>
                    <div class="chip-row">
                        <?php foreach ($kk_countries as $country): ?>
                            <span class="chip"><?php echo kk_e($country); ?></span>
                        <?php endforeach; ?>
                    </div>
                    <div class="world-map-graphic">
                        <div class="world-map-core"></div>
                        <span>Global Network</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container cta-banner">
                <div>
                    <span class="eyebrow">Ready to Expand?</span>
                    <h2>Book a free consultation with KK Group today.</h2>
                    <p>Get structured support for business setup, investment, real estate, trade or digital growth.</p>
                </div>
                <a class="button" href="<?php echo kk_e(kk_page_url('contact')); ?>">Book Free Consultation</a>
            </div>
        </section>
    </main>
    <?php
}
function kk_render_about(): void
{
    ?>
    <main>
        <section class="page-hero">
            <div class="container page-hero-inner">
                <span class="eyebrow">About Us</span>
                <h1>kk group of company</h1>
                <p>A multi-national all-in-one business group focused on strategic growth, corporate discipline and long-term investor confidence.</p>
            </div>
        </section>

        <section class="section">
            <div class="container grid grid-3">
                <div class="card info-card">
                    <span class="eyebrow">Company Introduction</span>
                    <p>We operate through specialised business units under unified governance and compliance standards to deliver integrated corporate solutions globally.</p>
                </div>
                <div class="card info-card">
                    <span class="eyebrow">Mission</span>
                    <p>To simplify cross-sector business growth with transparent structures, reliable delivery and international client support.</p>
                </div>
                <div class="card info-card">
                    <span class="eyebrow">Vision</span>
                    <p>To become the most trusted global business platform for entrepreneurs, investors and corporate partners.</p>
                </div>
            </div>
        </section>

        <section class="section section-alt">
            <div class="container two-col">
                <div class="content-card">
                    <span class="eyebrow">Core Values</span>
                    <h2>Integrity, transparency and sustainable growth guide every decision.</h2>
                    <ul class="tick-list">
                        <li>Integrity and accountability</li>
                        <li>International compliance</li>
                        <li>Investor-first execution</li>
                        <li>Long-term partnerships</li>
                    </ul>
                </div>
                <div class="content-card">
                    <span class="eyebrow">Leadership Message</span>
                    <h2>We build structured opportunities across sectors.</h2>
                    <p>From business support and trade to property, interiors, digital services and funding, we connect strategy with execution.</p>
                    <p>Our team works to keep communication direct, delivery reliable and outcomes measurable.</p>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">International Operations</span>
                    <h2>Regional alignment with global execution.</h2>
                </div>
                <div class="grid grid-4">
                    <div class="stat-card large"><strong>05+</strong><span>Regions & Markets</span></div>
                    <div class="stat-card large"><strong>24/7</strong><span>Client Coordination</span></div>
                    <div class="stat-card large"><strong>06</strong><span>Business Divisions</span></div>
                    <div class="stat-card large"><strong>10+</strong><span>Years of Leadership</span></div>
                </div>
            </div>
        </section>
    </main>
    <?php
}

function kk_render_services(): void
{
    ?>
    <main>
        <section class="page-hero">
            <div class="container page-hero-inner">
                <span class="eyebrow">Services</span>
                <h1>Corporate services designed for global expansion.</h1>
                <p>We support clients in business setup, cars, real estate, design, technology, trade, funding and minerals.</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <?php kk_render_service_cards(); ?>
            </div>
        </section>
        <section class="section section-alt">
            <div class="container grid grid-3">
                <div class="card info-card"><span class="eyebrow">How We Work</span><p>We listen, structure, execute and support with clear milestones and reporting.</p></div>
                <div class="card info-card"><span class="eyebrow">Secure Delivery</span><p>Compliance, documentation and transparent communication guide every project.</p></div>
                <div class="card info-card"><span class="eyebrow">International Coverage</span><p>We coordinate cross-border operations through trusted networks and partners.</p></div>
            </div>
        </section>
    </main>
    <?php
}

function kk_render_service_detail(array $service): void
{
    ?>
    <main>
        <section class="page-hero page-hero-service">
            <div class="container service-hero-grid">
                <div class="page-hero-inner">
                    <span class="eyebrow">Service Division</span>
                    <h1><?php echo kk_e((string) $service['name']); ?></h1>
                    <p><?php echo kk_e((string) $service['intro']); ?></p>
                    <div class="hero-actions">
                        <a class="button" href="<?php echo kk_e(kk_page_url('contact')); ?>">Get Consultation</a>
                        <a class="button button-outline" href="<?php echo kk_e(kk_page_url('investor-login')); ?>">Investor Desk</a>
                    </div>
                </div>
                <div class="service-hero-image">
                    <img src="<?php echo kk_e((string) $service['image']); ?>" alt="<?php echo kk_e((string) $service['name']); ?>">
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container two-col">
                <div class="content-card">
                    <span class="eyebrow">What We Offer</span>
                    <h2>Dedicated solutions for <?php echo kk_e((string) $service['short']); ?></h2>
                    <p><?php echo kk_e((string) $service['summary']); ?></p>
                    <ul class="tick-list">
                        <?php foreach ((array) $service['details'] as $detail): ?>
                            <li><?php echo kk_e((string) $detail); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <div class="card contact-form-card">
                    <span class="eyebrow">Service Contact</span>
                    <h3>Send us your requirement</h3>
                    <form method="post" action="<?php echo kk_e(kk_current_uri()); ?>" class="form-grid">
                        <input type="hidden" name="form_type" value="contact">
                        <input type="hidden" name="source_page" value="<?php echo kk_e((string) $service['slug']); ?>">
                        <input type="hidden" name="service_type" value="<?php echo kk_e((string) $service['name']); ?>">
                        <input type="hidden" name="redirect_to" value="<?php echo kk_e(kk_current_uri()); ?>">
                        <label class="field"><span>Name</span><input class="input" type="text" name="name" required></label>
                        <label class="field"><span>Email</span><input class="input" type="email" name="email" required></label>
                        <label class="field"><span>Phone</span><input class="input" type="text" name="phone"></label>
                        <label class="field"><span>Subject</span><input class="input" type="text" name="subject" value="<?php echo kk_e((string) $service['name']); ?>" required></label>
                        <label class="field field-full"><span>Message</span><textarea class="input textarea" name="message" rows="5" required>Tell me more about <?php echo kk_e((string) $service['name']); ?>.</textarea></label>
                        <button class="button button-wide" type="submit">Send Message</button>
                    </form>
                </div>
            </div>
        </section>

        <section class="section section-alt">
            <div class="container">
                <div class="section-head">
                    <span class="eyebrow">Related Services</span>
                    <h2>Explore more divisions of KK Group</h2>
                </div>
                <?php kk_render_service_cards(); ?>
            </div>
        </section>
    </main>
    <?php
}

function kk_render_portfolio(): void
{
    global $kk_portfolio;
    ?>
    <main>
        <section class="page-hero">
            <div class="container page-hero-inner">
                <span class="eyebrow">Portfolio</span>
                <h1>Selected work across business, trade and digital operations.</h1>
                <p>Completed projects, active transactions and client trust built over time.</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <?php kk_render_card_grid($kk_portfolio); ?>
            </div>
        </section>
        <section class="section section-alt">
            <div class="container grid grid-3">
                <div class="card info-card"><span class="eyebrow">Testimonial</span><p>Professional handling and clear communication from start to finish.</p><strong>- Corporate Client</strong></div>
                <div class="card info-card"><span class="eyebrow">Testimonial</span><p>Fast response, structured support and excellent follow-through.</p><strong>- Investor Partner</strong></div>
                <div class="card info-card"><span class="eyebrow">Testimonial</span><p>They helped us expand into new markets with confidence.</p><strong>- Business Owner</strong></div>
            </div>
        </section>
    </main>
    <?php
}

function kk_render_blog(): void
{
    global $kk_blog_posts;
    ?>
    <main>
        <section class="page-hero">
            <div class="container page-hero-inner">
                <span class="eyebrow">Blog</span>
                <h1>Insights for investors, founders and global operators.</h1>
                <p>Practical guidance across strategy, trade, technology and international business growth.</p>
            </div>
        </section>
        <section class="section">
            <div class="container">
                <?php kk_render_card_grid($kk_blog_posts); ?>
            </div>
        </section>
    </main>
    <?php
}

function kk_render_contact(): void
{
    ?>
    <main>
        <section class="page-hero">
            <div class="container page-hero-inner">
                <span class="eyebrow">Contact</span>
                <h1>Reach the right team quickly.</h1>
                <p>Use the form below for business support, investment, trade, property or digital enquiries.</p>
            </div>
        </section>
        <section class="section">
            <div class="container two-col">
                <div class="contact-stack">
                    <div class="card info-card">
                        <span class="eyebrow">Office Address</span>
                        <h3>KK Group of Companies</h3>
                        <p>Business Bay, Dubai, UAE</p>
                        <p>Spain | UAE | UK | Pakistan</p>
                    </div>
                    <div class="card info-card">
                        <span class="eyebrow">Email</span>
                        <h3><a href="mailto:<?php echo kk_e(SITE_EMAIL); ?>"><?php echo kk_e(SITE_EMAIL); ?></a></h3>
                    </div>
                    <div class="card info-card">
                        <span class="eyebrow">Phone & WhatsApp</span>
                        <h3><a href="tel:<?php echo kk_e(SITE_PHONE); ?>"><?php echo kk_e(SITE_PHONE); ?></a></h3>
                        <p><a href="https://wa.me/<?php echo kk_e(kk_phone_digits(SITE_WHATSAPP)); ?>?text=<?php echo rawurlencode(SITE_WHATSAPP_TEXT); ?>" target="_blank" rel="noreferrer">Open WhatsApp chat</a></p>
                    </div>
                </div>

                <div class="card contact-form-card">
                    <span class="eyebrow">Send Us Your Requirement</span>
                    <h3>Contact Leads</h3>
                    <form method="post" action="<?php echo kk_e(kk_current_uri()); ?>" class="form-grid">
                        <input type="hidden" name="form_type" value="contact">
                        <input type="hidden" name="source_page" value="contact">
                        <input type="hidden" name="redirect_to" value="<?php echo kk_e(kk_current_uri()); ?>">
                        <label class="field"><span>Name</span><input class="input" type="text" name="name" required></label>
                        <label class="field"><span>Email</span><input class="input" type="email" name="email" required></label>
                        <label class="field"><span>Phone</span><input class="input" type="text" name="phone" placeholder="<?php echo kk_e(SITE_PHONE); ?>"></label>
                        <label class="field"><span>Subject</span><input class="input" type="text" name="subject" placeholder="How can we help?" required></label>
                        <label class="field field-full"><span>Message</span><textarea class="input textarea" name="message" rows="6" required></textarea></label>
                        <button class="button button-wide" type="submit">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    </main>
    <?php
}
function kk_render_investor(PDO $pdo = null): void
{
    $isLoggedIn = kk_is_investor();
    $investor = null;
    if ($isLoggedIn) {
        $investor = $_SESSION['kk_investor'] ?? null;
        if ($pdo instanceof PDO && isset($investor['email'])) {
            $stmt = $pdo->prepare('SELECT * FROM kk_investor_accounts WHERE email = ? LIMIT 1');
            $stmt->execute([(string) $investor['email']]);
            $investor = $stmt->fetch() ?: $investor;
        }
    }
    ?>
    <main>
        <section class="page-hero">
            <div class="container page-hero-inner">
                <span class="eyebrow">Investor Login</span>
                <h1>Investor desk and application portal.</h1>
                <p>Register, log in and view application status for investment and funding opportunities.</p>
            </div>
        </section>

        <?php if ($isLoggedIn && is_array($investor)): ?>
            <section class="section">
                <div class="container two-col">
                    <div class="card dashboard-summary-card">
                        <span class="eyebrow">Your Account</span>
                        <h2><?php echo kk_e((string) ($investor['name'] ?? 'Investor')); ?></h2>
                        <p><strong>Email:</strong> <?php echo kk_e((string) ($investor['email'] ?? '')); ?></p>
                        <p><strong>Phone:</strong> <?php echo kk_e((string) ($investor['phone'] ?? '')); ?></p>
                        <p><strong>Country:</strong> <?php echo kk_e((string) ($investor['country'] ?? '')); ?></p>
                        <p><strong>Investment Amount:</strong> <?php echo kk_e(number_format((float) ($investor['investment_amount'] ?? 0), 0)); ?></p>
                        <p><strong>Status:</strong> <?php echo kk_status_badge((string) ($investor['status'] ?? 'pending')); ?></p>
                        <p class="muted">Our team reviews investor applications and updates status from the admin dashboard.</p>
                    </div>
                    <div class="card info-card">
                        <span class="eyebrow">Next Step</span>
                        <h3>Book a consultation with KK Group</h3>
                        <p>We can discuss ROI structure, legal agreements and partnership models after your application is reviewed.</p>
                        <a class="button" href="<?php echo kk_e(kk_page_url('contact')); ?>">Contact Investment Team</a>
                    </div>
                </div>
            </section>
        <?php endif; ?>

        <section class="section section-alt">
            <div class="container two-col">
                <div class="card contact-form-card">
                    <span class="eyebrow">Create Account</span>
                    <h3>Investor Registration</h3>
                    <form method="post" action="<?php echo kk_e(kk_current_uri()); ?>" class="form-grid">
                        <input type="hidden" name="form_type" value="investor-register">
                        <input type="hidden" name="redirect_to" value="<?php echo kk_e(kk_current_uri()); ?>">
                        <label class="field"><span>Full Name</span><input class="input" type="text" name="name" required></label>
                        <label class="field"><span>Email</span><input class="input" type="email" name="email" required></label>
                        <label class="field"><span>Phone</span><input class="input" type="text" name="phone" required></label>
                        <label class="field"><span>Country</span><input class="input" type="text" name="country" placeholder="Pakistan / UAE / UK"></label>
                        <label class="field"><span>Investment Amount</span><input class="input" type="number" min="0" step="0.01" name="investment_amount" placeholder="10000"></label>
                        <label class="field"><span>Password</span><input class="input" type="password" name="password" required></label>
                        <button class="button button-wide" type="submit">Create Account</button>
                    </form>
                </div>
                <div class="card contact-form-card">
                    <span class="eyebrow">Login</span>
                    <h3>Existing Investor Login</h3>
                    <form method="post" action="<?php echo kk_e(kk_current_uri()); ?>" class="form-grid">
                        <input type="hidden" name="form_type" value="investor-login">
                        <input type="hidden" name="redirect_to" value="<?php echo kk_e(kk_current_uri()); ?>">
                        <label class="field"><span>Email</span><input class="input" type="email" name="email" required></label>
                        <label class="field"><span>Password</span><input class="input" type="password" name="password" required></label>
                        <button class="button button-wide" type="submit">Login to Dashboard</button>
                    </form>
                    <div class="mini-info-box">
                        <strong>After login</strong>
                        <p>You can view application status, while the admin can approve or reject from the admin panel.</p>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <?php
}

function kk_render_admin(): void
{
    if (!kk_is_admin()) {
        ?>
        <main>
            <section class="page-hero">
                <div class="container page-hero-inner">
                    <span class="eyebrow">Admin Dashboard</span>
                    <h1>Operations, CRM and Lead Management</h1>
                    <p>This frontend includes a secure admin control panel for contacts, investors and workflow tracking.</p>
                </div>
            </section>
            <section class="section">
                <div class="container two-col admin-login-layout">
                    <div class="card info-card admin-info-card">
                        <span class="eyebrow">What the client can do</span>
                        <h2>Single place for all incoming business activity</h2>
                        <div class="info-list">
                            <div>
                                <h3>Contact Leads</h3>
                                <p>View every contact form submission from the website.</p>
                            </div>
                            <div>
                                <h3>Investor Requests</h3>
                                <p>Review pending investor applications and update approval status.</p>
                            </div>
                            <div>
                                <h3>Secure Access</h3>
                                <p>Only accounts with admin role can access this dashboard.</p>
                            </div>
                        </div>
                    </div>
                    <div class="card contact-form-card admin-login-card">
                        <span class="eyebrow">Admin Login</span>
                        <h3>Sign in to manage the site</h3>
                        <form method="post" action="<?php echo kk_e(kk_current_uri()); ?>" class="form-grid">
                            <input type="hidden" name="form_type" value="admin-login">
                            <input type="hidden" name="redirect_to" value="/admin">
                            <label class="field"><span>Email</span><input class="input" type="email" name="email" required></label>
                            <label class="field"><span>Password</span><input class="input" type="password" name="password" required></label>
                            <button class="button button-wide" type="submit">Login to Admin</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
        <?php
        return;
    }

    $pdo = kk_db_connection();
    $stats = kk_admin_stats($pdo);
    $contacts = kk_grab_contacts($pdo, 12);
    $investors = kk_grab_investors($pdo, 12);
    $newsletters = kk_grab_newsletters($pdo, 12);
    ?>
    <main>
        <section class="page-hero">
            <div class="container page-hero-inner">
                <span class="eyebrow">Admin Dashboard</span>
                <h1>Operations, CRM and Lead Management</h1>
                <p>Welcome back, <?php echo kk_e(kk_admin_name()); ?>. Monitor contacts, investor requests and newsletter subscribers from one secure place.</p>
            </div>
        </section>

        <section class="section dashboard-section">
            <div class="container">
                <div class="grid grid-4 kpi-grid">
                    <div class="stat-card large"><strong><?php echo kk_e((string) $stats['contacts_total']); ?></strong><span>Total Contacts</span></div>
                    <div class="stat-card large"><strong><?php echo kk_e((string) $stats['contacts_new']); ?></strong><span>New Contacts</span></div>
                    <div class="stat-card large"><strong><?php echo kk_e((string) $stats['investors_pending']); ?></strong><span>Pending Investors</span></div>
                    <div class="stat-card large"><strong><?php echo kk_e((string) $stats['newsletters_total']); ?></strong><span>Newsletter Subscribers</span></div>
                </div>
                <div class="grid grid-4 kpi-grid secondary">
                    <div class="stat-card"><strong><?php echo kk_e((string) $stats['investors_total']); ?></strong><span>Total Investors</span></div>
                    <div class="stat-card"><strong><?php echo kk_e((string) $stats['investors_approved']); ?></strong><span>Approved</span></div>
                    <div class="stat-card"><strong><?php echo kk_e((string) $stats['investors_rejected']); ?></strong><span>Rejected</span></div>
                    <div class="stat-card"><strong><?php echo kk_e((string) $stats['contacts_new']); ?></strong><span>Unread Leads</span></div>
                </div>
            </div>
        </section>

        <section class="section section-alt">
            <div class="container dashboard-grid">
                <div class="table-card">
                    <div class="table-head">
                        <h2>Recent Contacts</h2>
                        <span><?php echo kk_e((string) count($contacts)); ?> shown</span>
                    </div>
                    <div class="table-wrap">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Subject</th>
                                    <th>Page</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!$contacts): ?>
                                    <tr><td colspan="6" class="empty-state">No contacts yet.</td></tr>
                                <?php else: ?>
                                    <?php foreach ($contacts as $contact): ?>
                                        <tr>
                                            <td>
                                                <strong><?php echo kk_e((string) $contact['name']); ?></strong><br>
                                                <span class="muted small"><?php echo kk_e((string) $contact['created_at']); ?></span>
                                            </td>
                                            <td>
                                                <?php echo kk_e((string) $contact['email']); ?><br>
                                                <?php echo kk_e((string) ($contact['phone'] ?? '')); ?>
                                            </td>
                                            <td><?php echo kk_e((string) ($contact['subject'] ?? '')); ?></td>
                                            <td><?php echo kk_e((string) ($contact['source_page'] ?? '')); ?></td>
                                            <td><?php echo kk_status_badge((string) ($contact['status'] ?? 'new')); ?></td>
                                            <td>
                                                <form method="post" action="<?php echo kk_e(kk_current_uri()); ?>" class="inline-form">
                                                    <input type="hidden" name="form_type" value="admin-contact-status">
                                                    <input type="hidden" name="id" value="<?php echo kk_e((string) $contact['id']); ?>">
                                                    <input type="hidden" name="status" value="<?php echo ($contact['status'] ?? 'new') === 'new' ? 'read' : 'new'; ?>">
                                                    <button type="submit" class="button button-small button-outline"><?php echo ($contact['status'] ?? 'new') === 'new' ? 'Mark Read' : 'Mark New'; ?></button>
                                                </form>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="table-card">
                    <div class="table-head">
                        <h2>Investor Applications</h2>
                        <span>Approve / reject from here</span>
                    </div>
                    <div class="table-wrap">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Investor</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!$investors): ?>
                                    <tr><td colspan="4" class="empty-state">No investor applications yet.</td></tr>
                                <?php else: ?>
                                    <?php foreach ($investors as $investor): ?>
                                        <tr>
                                            <td>
                                                <strong><?php echo kk_e((string) $investor['name']); ?></strong><br>
                                                <span class="muted small"><?php echo kk_e((string) $investor['email']); ?></span><br>
                                                <span class="muted small"><?php echo kk_e((string) ($investor['country'] ?? '')); ?></span>
                                            </td>
                                            <td>Rs <?php echo kk_e(number_format((float) ($investor['investment_amount'] ?? 0), 0)); ?></td>
                                            <td><?php echo kk_status_badge((string) ($investor['status'] ?? 'pending')); ?></td>
                                            <td>
                                                <form method="post" action="<?php echo kk_e(kk_current_uri()); ?>" class="inline-form status-form">
                                                    <input type="hidden" name="form_type" value="admin-investor-status">
                                                    <input type="hidden" name="id" value="<?php echo kk_e((string) $investor['id']); ?>">
                                                    <select name="status" class="input input-small">
                                                        <option value="pending" <?php echo ($investor['status'] ?? '') === 'pending' ? 'selected' : ''; ?>>Pending</option>
                                                        <option value="approved" <?php echo ($investor['status'] ?? '') === 'approved' ? 'selected' : ''; ?>>Approved</option>
                                                        <option value="rejected" <?php echo ($investor['status'] ?? '') === 'rejected' ? 'selected' : ''; ?>>Rejected</option>
                                                    </select>
                                                    <button type="submit" class="button button-small">Save</button>
                                                </form>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>

        <section class="section">
            <div class="container dashboard-grid single">
                <div class="table-card">
                    <div class="table-head">
                        <h2>Newsletter Subscribers</h2>
                        <span>Email list</span>
                    </div>
                    <div class="table-wrap">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!$newsletters): ?>
                                    <tr><td colspan="2" class="empty-state">No newsletter subscribers yet.</td></tr>
                                <?php else: ?>
                                    <?php foreach ($newsletters as $newsletter): ?>
                                        <tr>
                                            <td><?php echo kk_e((string) $newsletter['email']); ?></td>
                                            <td><?php echo kk_e((string) $newsletter['created_at']); ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <?php
}

function kk_render_not_found(): void
{
    ?>
    <main>
        <section class="page-hero">
            <div class="container page-hero-inner">
                <span class="eyebrow">404</span>
                <h1>Page not found</h1>
                <p>The page you requested does not exist. Please use the navigation above to continue browsing KK Group.</p>
                <div class="hero-actions">
                    <a class="button" href="<?php echo kk_e(kk_page_url('home')); ?>">Go Home</a>
                    <a class="button button-outline" href="<?php echo kk_e(kk_page_url('contact')); ?>">Contact Us</a>
                </div>
            </div>
        </section>
    </main>
    <?php
}
$pathInfo = kk_request_path();

if ($pathInfo === '/admin/logout') {
    session_unset();
    session_destroy();
    session_start();
    kk_flash('success', 'You have been logged out successfully.');
    kk_redirect('/admin');
}

if (kk_is_post('newsletter')) {
    try {
        $pdo = kk_db_connection();
        $email = filter_var(kk_input('email'), FILTER_VALIDATE_EMAIL);
        if (!$email) {
            kk_redirect_with_flash('error', 'Please enter a valid email address.', kk_request_path());
        }

        $stmt = $pdo->prepare('INSERT INTO kk_newsletters (email) VALUES (?)');
        $stmt->execute([$email]);
        kk_redirect_with_flash('success', 'Thank you. You have been subscribed to the newsletter.', kk_request_path());
    } catch (Throwable $exception) {
        if (strpos(strtolower($exception->getMessage()), 'duplicate') !== false) {
            kk_redirect_with_flash('info', 'This email is already subscribed.', kk_request_path());
        }
        kk_redirect_with_flash('error', 'We could not subscribe your email right now.', kk_request_path());
    }
}

if (kk_is_post('contact')) {
    try {
        $pdo = kk_db_connection();
        $name = kk_input('name');
        $email = filter_var(kk_input('email'), FILTER_VALIDATE_EMAIL);
        $phone = kk_input('phone');
        $subject = kk_input('subject', 'Website enquiry');
        $serviceType = kk_input('service_type', 'General');
        $message = kk_input('message');
        $sourcePage = kk_input('source_page', kk_request_path());

        if ($name === '' || !$email || $message === '') {
            kk_redirect_with_flash('error', 'Please complete the contact form with a valid name, email and message.', kk_request_path());
        }

        $stmt = $pdo->prepare('INSERT INTO kk_contacts (name, email, phone, subject, service_type, message, source_page) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $name,
            $email,
            $phone !== '' ? $phone : null,
            $subject !== '' ? $subject : null,
            $serviceType !== '' ? $serviceType : null,
            $message,
            $sourcePage !== '' ? $sourcePage : null,
        ]);

        kk_redirect_with_flash('success', 'Thank you. Your message has been submitted successfully.', kk_request_path());
    } catch (Throwable $exception) {
        kk_redirect_with_flash('error', 'We could not submit your message right now.', kk_request_path());
    }
}

if (kk_is_post('investor-register')) {
    try {
        $pdo = kk_db_connection();
        $name = kk_input('name');
        $email = filter_var(kk_input('email'), FILTER_VALIDATE_EMAIL);
        $phone = kk_input('phone');
        $country = kk_input('country');
        $amount = kk_amount(kk_input('investment_amount', '0'));
        $password = (string) ($_POST['password'] ?? '');

        if ($name === '' || !$email || $phone === '' || $password === '') {
            kk_redirect_with_flash('error', 'Please fill in all required investor registration fields.', kk_request_path());
        }

        $exists = $pdo->prepare('SELECT id FROM kk_investor_accounts WHERE email = ? LIMIT 1');
        $exists->execute([$email]);
        if ($exists->fetchColumn()) {
            kk_redirect_with_flash('error', 'This investor email is already registered.', kk_request_path());
        }

        $stmt = $pdo->prepare('INSERT INTO kk_investor_accounts (name, email, phone, country, investment_amount, password_hash, status) VALUES (?, ?, ?, ?, ?, ?, "pending")');
        $stmt->execute([
            $name,
            $email,
            $phone,
            $country !== '' ? $country : null,
            $amount,
            password_hash($password, PASSWORD_DEFAULT),
        ]);

        $_SESSION['kk_investor'] = [
            'name' => $name,
            'email' => $email,
            'phone' => $phone,
            'country' => $country,
            'investment_amount' => $amount,
            'status' => 'pending',
        ];

        kk_redirect_with_flash('success', 'Investor account created and logged in successfully.', kk_request_path());
    } catch (Throwable $exception) {
        kk_redirect_with_flash('error', 'We could not create the investor account right now.', kk_request_path());
    }
}

if (kk_is_post('investor-login')) {
    try {
        $pdo = kk_db_connection();
        $email = filter_var(kk_input('email'), FILTER_VALIDATE_EMAIL);
        $password = (string) ($_POST['password'] ?? '');

        if (!$email || $password === '') {
            kk_redirect_with_flash('error', 'Please enter a valid email and password.', kk_request_path());
        }

        $stmt = $pdo->prepare('SELECT * FROM kk_investor_accounts WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $investor = $stmt->fetch();
        if (!$investor || !password_verify($password, (string) $investor['password_hash'])) {
            kk_redirect_with_flash('error', 'Invalid investor credentials.', kk_request_path());
        }

        $_SESSION['kk_investor'] = [
            'name' => $investor['name'],
            'email' => $investor['email'],
            'phone' => $investor['phone'],
            'country' => $investor['country'],
            'investment_amount' => $investor['investment_amount'],
            'status' => $investor['status'],
        ];

        kk_redirect_with_flash('success', 'Investor login successful.', kk_request_path());
    } catch (Throwable $exception) {
        kk_redirect_with_flash('error', 'We could not log you in right now.', kk_request_path());
    }
}

if (kk_is_post('admin-login')) {
    try {
        $pdo = kk_db_connection();
        $email = filter_var(kk_input('email'), FILTER_VALIDATE_EMAIL);
        $password = (string) ($_POST['password'] ?? '');

        if (!$email || $password === '') {
            kk_redirect_with_flash('error', 'Please enter a valid admin email and password.', '/admin');
        }

        $stmt = $pdo->prepare('SELECT * FROM kk_admins WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $admin = $stmt->fetch();
        if (!$admin || !password_verify($password, (string) $admin['password_hash'])) {
            kk_redirect_with_flash('error', 'Invalid admin credentials.', '/admin');
        }

        $_SESSION['kk_admin'] = [
            'id' => $admin['id'],
            'name' => $admin['name'],
            'email' => $admin['email'],
        ];

        kk_redirect_with_flash('success', 'Welcome back, ' . $admin['name'] . '.', '/admin');
    } catch (Throwable $exception) {
        kk_redirect_with_flash('error', 'We could not log you in right now.', '/admin');
    }
}

if (kk_is_post('admin-investor-status')) {
    if (!kk_is_admin()) {
        kk_redirect_with_flash('error', 'Please login as admin first.', '/admin');
    }
    try {
        $pdo = kk_db_connection();
        $id = (int) ($_POST['id'] ?? 0);
        $status = kk_safe_status((string) ($_POST['status'] ?? 'pending'), ['pending', 'approved', 'rejected']);
        if ($id <= 0) {
            kk_redirect_with_flash('error', 'Invalid investor record.', '/admin');
        }
        $stmt = $pdo->prepare('UPDATE kk_investor_accounts SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        kk_redirect_with_flash('success', 'Investor status updated successfully.', '/admin');
    } catch (Throwable $exception) {
        kk_redirect_with_flash('error', 'We could not update the investor right now.', '/admin');
    }
}

if (kk_is_post('admin-contact-status')) {
    if (!kk_is_admin()) {
        kk_redirect_with_flash('error', 'Please login as admin first.', '/admin');
    }
    try {
        $pdo = kk_db_connection();
        $id = (int) ($_POST['id'] ?? 0);
        $status = kk_safe_status((string) ($_POST['status'] ?? 'new'), ['new', 'read', 'archived']);
        if ($id <= 0) {
            kk_redirect_with_flash('error', 'Invalid contact record.', '/admin');
        }
        $stmt = $pdo->prepare('UPDATE kk_contacts SET status = ? WHERE id = ?');
        $stmt->execute([$status, $id]);
        kk_redirect_with_flash('success', 'Contact status updated successfully.', '/admin');
    } catch (Throwable $exception) {
        kk_redirect_with_flash('error', 'We could not update the contact right now.', '/admin');
    }
}

$route = kk_request_path();
$page = 'home';
$slug = '';

if ($route === '/') {
    $page = 'home';
} elseif ($route === '/about') {
    $page = 'about';
} elseif ($route === '/services') {
    $page = 'services';
} elseif ($route === '/portfolio') {
    $page = 'portfolio';
} elseif ($route === '/blog') {
    $page = 'blog';
} elseif ($route === '/contact') {
    $page = 'contact';
} elseif ($route === '/investor-login') {
    $page = 'investor-login';
} elseif ($route === '/admin') {
    $page = 'admin';
} elseif (strpos($route, '/service/') === 0) {
    $page = 'service';
    $slug = rawurldecode(substr($route, strlen('/service/')));
} else {
    $page = 'not-found';
}

$service = $page === 'service' ? kk_find_service($slug) : null;
$bodyClass = 'page-' . $page;
$titleMap = [
    'home' => SITE_NAME . ' | ' . SITE_TAGLINE,
    'about' => 'About Us | ' . SITE_NAME,
    'services' => 'Services | ' . SITE_NAME,
    'portfolio' => 'Portfolio | ' . SITE_NAME,
    'blog' => 'Blog | ' . SITE_NAME,
    'contact' => 'Contact Us | ' . SITE_NAME,
    'investor-login' => 'Investor Login | ' . SITE_NAME,
    'admin' => 'Admin Dashboard | ' . SITE_NAME,
    'service' => ($service['name'] ?? 'Service') . ' | ' . SITE_NAME,
    'not-found' => '404 | ' . SITE_NAME,
];
$descMap = [
    'home' => 'KK Group of Companies provides business support, automobiles, real estate, interior design, IT, import export and investment services worldwide.',
    'about' => 'Learn about KK Group of Companies, our mission, values, international operations and leadership.',
    'services' => 'Explore KK Group business services across business support, trade, property, technology, investment and minerals.',
    'portfolio' => 'See KK Group portfolio highlights including IT projects, real estate deals, car transactions and interior work.',
    'blog' => 'Read KK Group insights on global business, trade, digital growth and investment.',
    'contact' => 'Contact KK Group for business support, trade, investment or digital services.',
    'investor-login' => 'Investor registration, login and application status portal for KK Group.',
    'admin' => 'Secure admin dashboard for KK Group contacts, investor applications and newsletters.',
    'service' => (string) ($service['summary'] ?? SITE_TAGLINE),
    'not-found' => 'The page you requested was not found.',
];

kk_render_head($titleMap[$page] ?? SITE_NAME, $descMap[$page] ?? SITE_TAGLINE, $bodyClass);
kk_render_header($page);
kk_render_flash();

if ($page === 'home') {
    kk_render_home();
} elseif ($page === 'about') {
    kk_render_about();
} elseif ($page === 'services') {
    kk_render_services();
} elseif ($page === 'portfolio') {
    kk_render_portfolio();
} elseif ($page === 'blog') {
    kk_render_blog();
} elseif ($page === 'contact') {
    kk_render_contact();
} elseif ($page === 'investor-login') {
    kk_render_investor(isset($pdo) && $pdo instanceof PDO ? $pdo : null);
} elseif ($page === 'admin') {
    kk_render_admin();
} elseif ($page === 'service' && is_array($service)) {
    kk_render_service_detail($service);
} else {
    kk_render_not_found();
}

kk_render_footer();


