# GILVER

A Persian RTL jewelry storefront hosted on GitHub Pages.

## Database behavior on GitHub Pages

This project runs without a server. JavaScript stores users, products, orders, and logs in browser LocalStorage. The admin dashboard reads and displays those records. It also supports exporting and importing a JSON backup.

- The first account created in an empty browser profile becomes owner.
- Owner can manage account roles and block/unblock users.
- Admin and seller can manage products according to their permissions.
- Product images are resized and compressed before being stored.
- Use **ذخیره نسخه پشتیبان** in the admin dashboard to download a portable JSON database file; use **بازیابی از فایل** to restore it on another browser/device.

## Important limitations

GitHub Pages is static hosting. Browser JavaScript cannot write a TXT/JSON file into the GitHub repository, cannot run SQLite, and cannot create a shared database for all visitors. LocalStorage belongs to one browser profile on one device. Different visitors do not share accounts or records. Clearing browser data can erase the database. The backup file is the manual way to move/keep the data.

This is a local/demo database, not a secure production backend. Do not use it for real payment or sensitive customer information.

## Pages

- `index.html`: storefront
- `login.html`: sign-in and registration
- `account.html`: account page
- `admin.html`: local admin dashboard
