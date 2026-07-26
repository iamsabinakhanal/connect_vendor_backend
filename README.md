# Pasaley Guff Backend

Backend API for Pasaley Guff, a social media app focused on vendors.

## What Is Pasaley Guff?

Pasaley Guff is a vendor-focused social platform where:
- Users are vendors.
- Admin creates and manages communities.
- Vendors can post only after joining a community.
- Communities can be public or private.
- Messaging is allowed only between users in the same community.
- Admin has full visibility and management controls.

## Implemented Modules

- User CRUD (admin) and registration (public)
- Category CRUD (admin)
- Community CRUD (admin)
- Community join/add-member flow
- Post CRUD with membership rule
- Messaging with same-community rule
- Reports creation (users) and moderation (admin)
- Notification sending (admin) and reading (user)
- User profile photo upload (mobile-friendly multipart endpoint)

## Upload User Photo

Users can upload a profile photo from mobile camera or gallery.

Endpoint:

```http
POST /api/users/me/photo
```

Headers:

```http
x-user-id: <user-id>
Content-Type: multipart/form-data
```

Body (form-data):

- `photo`: image file (`image/*`, max 5MB)

Response includes `user.photoUrl` as a direct URL. The URL is public and can be opened/tapped (clicked) from mobile app UI.

Optional environment variable for public URL host:

```bash
PUBLIC_BASE_URL=http://localhost:4000
```

## Core Business Rules Enforced

1. Only admin can create community.
2. Only admin can view full user details.
3. Vendor must join community before creating posts.
4. Community visibility supports `PUBLIC` and `PRIVATE`.
5. Messaging allowed only between users within the same community.

## Seed Users For Testing

Use the `x-user-id` header:
- Admin: `11111111-1111-1111-1111-111111111111`
- Vendor 1: `22222222-2222-2222-2222-222222222222`
- Vendor 2: `33333333-3333-3333-3333-333333333333`

Default seed category/community:
- Category: `aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa`
- Community: `bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb`

## Run Project

```bash
npm install
copy .env.example .env
npm run dev
```

Server default port: `4000`

MongoDB config:

```bash
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.rzvikrn.mongodb.net/pasaley_guff?retryWrites=true&w=majority&appName=Cluster0
MONGODB_DB_NAME=pasaley_guff
```

If your MongoDB password includes special characters (like `@`, `#`, `%`), URL-encode it in `MONGODB_URI`.

Health check:

```http
GET http://localhost:4000/health
```

## Postman

Import this collection:
- `postman/Pasaley-Guff.postman_collection.json`

It includes requests for:
- Users
- Communities
- Posts
- Messages
- Reports
- Admin user/category/community/post/report/notification management

## Clean Architecture Layout

The codebase is organized by responsibility:

- `src/controller` for HTTP presentation logic
- `src/service` for application business rules
- `src/database` for MongoDB connection, models, and seeding
- `src/middleware` for auth and error handling
- `src/models` and `src/type` for domain shapes and enums
