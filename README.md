# GILVER — Gold & Silver Atelier

Persian RTL jewelry storefront. Frontend: HTML/CSS/vanilla JS. Backend: Supabase Auth + Postgres + Row Level Security.

## Supabase setup

1. Create a project at https://supabase.com/dashboard.
2. Open Project Settings → API and copy the Project URL and publishable key (or legacy anon key). Never use the service_role key in frontend code.
3. Replace the placeholders in assets/js/supabase-config.js with the Project URL and publishable/anon key.
4. In Authentication → Providers → Email, enable email/password.
5. Keep public sign-ups disabled for the initial setup.
6. Run all SQL in supabase/schema.sql using SQL Editor → New query.
7. Now, while public sign-ups are still disabled, create your own first account through Authentication → Users → Add user and confirm it. The database trigger will create its profile and assign admin exactly once. Verify role=admin in Table Editor. Never let an unknown visitor become the first account.
8. Only after verifying your admin account, enable public sign-ups if wanted.
9. Authentication → URL Configuration: Site URL = https://mon9900mr.github.io/Gilver/ and Redirect URL = https://mon9900mr.github.io/Gilver/**.
10. Deploy GitHub Pages. Use login.html to sign in, account.html for the user account, and admin.html for the protected admin dashboard.

## Security
- Only the Supabase URL and publishable/anon key are allowed in frontend config. Never expose service_role.
- RLS protects profiles, products, orders, settings and audit logs.
- First-admin bootstrap is serialized with a database row lock; only one account can receive admin.
- Audit rows are inserted by database triggers. Browser users cannot write or delete audit logs.
- Authentication sign-in events are available in Supabase Dashboard → Authentication → Logs.
- Before real checkout, implement a server-side Edge Function to validate product prices and calculate totals. Do not trust prices from the browser.

## Current limitations
Existing storefront product catalog and cart/wishlist still use demo data and localStorage. Contact/newsletter and payment flows are not connected yet. Admin products are stored in Supabase but not yet synced to storefront pages.
