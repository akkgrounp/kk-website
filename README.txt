KK Group of Companies - PHP / MySQL cPanel Package

This folder is ready for cPanel shared hosting.

Upload steps:
1. Create a MySQL database in cPanel.
2. Create a MySQL user and assign ALL PRIVILEGES to that database.
3. Open includes/config.php and set:
   - DB_HOST
   - DB_NAME
   - DB_USER
   - DB_PASS
4. Upload the full contents of this folder into your cPanel document root.
   - Usually public_html/akk
5. Make sure index.php is in the root of that folder.
6. Make sure the assets/ and includes/ folders are uploaded too.

Main pages:
- /
- /about
- /services
- /portfolio
- /blog
- /contact
- /investor-login
- /admin
- /service/{slug}

Admin login bootstrap:
- Admin name and email are controlled from includes/config.php.
- The first successful database connection creates the admin account automatically.

If you only want to test locally:
- Open index.php through a PHP server, or use cPanel preview once uploaded.

If the website looks blank:
- Check the MySQL credentials in includes/config.php.
- Check that index.php is inside the right folder.
- Check that the domain points to the same document root.
