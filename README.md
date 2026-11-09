# GILVER

A Persian RTL jewelry storefront hosted on GitHub Pages.

## Lightweight browser database

This GitHub Pages build uses `assets/js/database.js` with browser LocalStorage. It can save and read account records, products, orders, and activity logs in the same browser profile.

- First account created in a fresh browser profile is assigned `owner`.
- Owner can assign `admin`, `seller`, or `customer` roles and ban/unban accounts.
- Admin can manage products; seller can add/update products; customer uses the storefront.
- Product records saved from the admin dashboard are loaded by the storefront.

## Important limitations

This is a local/demo database, not a private server database. Data is stored in the visitor's browser, not in GitHub repository files. Other devices and visitors do not share it. Browser storage can be cleared or edited by the user. Client-side roles and password hashing do not provide real authorization against a malicious user. Do not use this for real customer accounts, private information, payments, or production moderation.

For a real multi-user store with private data and reliable owner/admin permissions, a backend service is required. GitHub Pages cannot run SQLite or a Node/PHP server.

## Pages

- `index.html`: storefront
- `login.html`: sign-in and registration
- `account.html`: account page
- `admin.html`: local admin dashboard
