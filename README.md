# KK Group Website - cPanel PHP/MySQL Package

This repository contains the client handover version of the KK Group website for cPanel hosting.

## What this repo is
- Backend: PHP
- Database: MySQL
- Hosting target: cPanel shared hosting
- Live domain target: `akkgroups.com`

## Upload to cPanel
Upload these files/folders into the domain document root, usually `public_html/akk`:
- `index.php`
- `.htaccess`
- `database.sql`
- `START_HERE.txt`
- `assets/`
- `includes/`

## Remove from the old site folder
Delete any old WordPress files before uploading the KK package:
- `wp-admin/`
- `wp-content/`
- `wp-includes/`
- `wp-config.php`
- old WordPress `index.php`
- any leftover WordPress readme/license files

## Database setup
1. Create a MySQL database in cPanel.
2. Create a MySQL user.
3. Grant the user ALL PRIVILEGES.
4. Open `includes/config.php` and fill in:
   - `DB_HOST`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASS`
5. Import `database.sql` in phpMyAdmin.

## Important
- GitHub pushes do not update a cPanel live domain automatically.
- To update `akkgroups.com`, the updated files must be uploaded in cPanel.

## Admin login
The admin account is bootstrapped from `includes/config.php`.

## Local server note
If you want to test locally, use a PHP server or cPanel preview once uploaded.
