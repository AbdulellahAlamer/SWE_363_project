# KFUPM Clubs Hub

Front-end prototype for the KFUPM Clubs Hub where admins, presidents, and students manage clubs, events, and personal activity.

## Pages

- `LoginPage.jsx` – role-based login form with “forgot password” modal trigger.
- `RegisterPage.jsx` – captures student details to create a new account.
- `ResetPassword.jsx` – consumes `?user_id=` links to post new passwords to the API.
- `ClubsPage.jsx` – searchable, filterable catalog of clubs that support join/view actions.
- `ClubProfile.jsx` – detailed view of a single club with subscribe/share controls and upcoming events.
- `MyClubsPage.jsx` – shows the student’s joined clubs plus progress summaries (see page file for logic).
- `EventsPage.jsx` – filters sample events into Upcoming/Past/All with quick stats.
- `PostsPage.jsx` – lists recent club announcements using `PostCard` tiles.
- `MyProfilePage.jsx` – student profile editor with event history, joined clubs, and certificates.
- `AdminPage.jsx` – admin dashboard for seeding, editing, and publishing clubs.
- `PresidentPage.jsx` – workspace for club presidents to track stats and manage posts/events.
- `UserManagementPage.jsx` – admin-level table for viewing and editing user accounts.

## Components

- `NavigationBar.jsx` – persistent sidebar navigation with role-aware link sets.
- `StatisticsNavbar.jsx` – horizontal strip that renders quick metric tiles for dashboards.
- `Button.jsx` – shared button element supporting the design system variants.
- `PageTitle.jsx` – standardized heading + subheading block for page tops.
- `PopupForm.jsx` – reusable modal form (used for forgot password) that posts to an endpoint.
- `ClubCard.jsx` – card showing club info with join/view interactions.
- `EventCard.jsx` / `EventCardProf.jsx` – responsive event summaries for list pages and club profile.
- `FilterButton.jsx` – pill-style toggle used to switch event filters.
- `StatCard.jsx` – small KPI cards displaying a label and value.
- `Table.jsx` – generic table layout with header, row, and action slot helpers.
- `PostCard.jsx` – visual card for news posts including author and date.

Use `npm install` then `npm run dev` to start the Vite dev server.
