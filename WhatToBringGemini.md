# WhatToBring

## Overview
This is an old coding project that I want to understand and continue building. The idea is whattobring. I want to a login page to cutomize views and permissions for each users. I would like to use postgres with prisma orm to handle data. The main idea is to have a group of people sharing one list - a list of items to bring (perhaps for planning a party, cookout, apartment decorating, etc.). users can add items to a list and suggest items for others to bring. users can claim to take items from the suggested list. One user can be a part of multiple forms, or events (for example they can be a part of a bbq event where they are bringing corn and a potluck where they are brining soup). 

### Main Features
#### RSVP
Guests can rsvp to an event and add it to their calendar. The owner of the event will receive a notification of the rsvp and the guest list is updated.
#### Lists
There are two lists: Who's Bringing What and Suggestions. The Who's Bringing What List is initially emtpy. Users can create manual inputs. The Suggestion list can be initially empty of pre set by the event owner. The owner can determine if users in the event can contribute items to the suggestion list. If users are permitted to add they can manually add suggestions to the suggestion list. All users can claim items from the suggestions list by sleection them. This adds the item to the Whos Brining What list and assigns it to them.
#### Owners and Guests
Owners create events and invite other users to join the event as guests.
#### Calendar
Users have a calendar of events and what they are bringing
#### Templates
Users can use pre-made templates to start their lists (start the suggested list with pre filled items)
#### Push notifications
Guests are notified that they have not yet chosen an item to bring. They are notified about upcoming events. they are also given suggestions about where to purchase the item.


### Getting Started
These are basic notes and ideas. I want to go through this slowly, checking in with me for each step and continue to ideate. 

#### First Step: Repository Audit & Inventory
Here is what is currently present in the repository from the starter code and previous work:

- **Monorepo Architecture**:
  - Turborepo + Yarn 4 (Berry with PnP) workspaces: `apps/frontend`, `apps/backend`, `packages/database`, `packages/common`, `configs/*`.
- **Database & ORM**:
  - PostgreSQL configured with Docker Compose (`docker/docker-compose.yml`) & local `.env`.
  - Prisma ORM schema (`packages/database/prisma/schema.prisma`) already has models defined for `User`, `List`, `ListMember`, `BringItem`, `SuggestItem`, and `ItemAssignment` (plus starter relic `Score`).
  - Prisma seed script (`prisma/seed.ts`) populates initial users (`nora`, `guest`), two sample lists ("Camping Trip", "Friends-giving"), memberships, and sample bring items.
- **Backend (`apps/backend`)**:
  - Express server with TypeScript, `express-session`, cookie authentication, CORS credentials.
  - `/api/login` handles username/password authentication (bcrypt) and signup.
  - `/api/user/lists` returns user list memberships.
  - Starter relic routes (`/api/score`, `/api/healthcheck`).
- **Frontend (`apps/frontend`)**:
  - React 18 + Vite (SWC) + TypeScript + Tailwind CSS v4 (`@tailwindcss/vite`).
  - Rich UI component library using `@radix-ui` primitives (`Button`, `Card`, `Input`, `Label`, `Calendar`, etc.) and `lucide-react` icons.
  - Date picking via `react-day-picker`.
  - Routing with `react-router-dom` v6 (`Login.tsx`, `Home.tsx`, `PageNotFound.tsx`, starter examples).
  - `Home.tsx` dashboard shows a welcome banner, calendar component, and cards for lists.

---

### Feature Checklist & Progress

#### 1. Authentication & User Management
- [x] Password hashing with bcrypt
- [x] User login route with session cookies (`/api/login`)
- [x] User signup route (`/api/login/signup`)
- [x] Frontend Login page & signup modal (`Login.tsx`)
- [ ] Session validation / "who am I" route (`/api/login/me` or `/api/user/me`)
- [x] Logout functionality & button (integrated in Header)
- [x] Smooth error handling & redirection on invalid/expired session

#### 2. Dashboard (`Home.tsx`) & Navigation
- [x] Header shell with brand, notification bell & profile dropdown
- [x] Calendar component display
- [x] Cards for "My Items", "My Lists", "Shared with me"
- [x] Fix backend `/api/user/lists` to return both `ownedLists` and `memberLists`
- [x] Top Action Bar: `[ + Create New Event ]`, `[ 📁 Browse Templates ]`, `[ 📅 See All Events ]`
- [x] Active & Upcoming Events feed with 3-event pagination (Concept 2 rich cards)
- [x] Show actual assigned items in "My Items Checklist" card (with interactive checkmarks)
- [ ] Host Guest Roster & RSVP management card (for owned events)
- [ ] Clickable event links that navigate to individual event detail pages (`/lists/:id`)
- [x] Connect calendar to filter events on date click

#### 3. Event Detail & List Management (Core "What to Bring")
- [ ] Event detail page route (`/lists/:id`)
- [ ] Event header info (title, date, location, description, owner)
- [ ] **"Who's Bringing What" List**:
  - [ ] View items and who they are assigned to
  - [ ] Manual item creation by owner or permitted guests
  - [ ] Edit / remove items
  - [ ] Assign / unassign items
- [ ] **"Suggestions" List**:
  - [ ] View suggested items
  - [ ] Permission check: allow guests to suggest items based on event setting
  - [ ] Add item suggestions
  - [ ] "Claim" action: select an item from suggestions to automatically add it to "Who's Bringing What" assigned to the claimant
  - [ ] Owner approval / rejection of suggestions (if required)

#### 4. Guests & RSVP
- [ ] Add RSVP status to list memberships in Prisma schema (`attending`, `maybe`, `declined`, `pending`)
- [ ] Invite guests to an event by username
- [ ] Guest RSVP UI on event page / dashboard
- [ ] Notify owner when guest updates RSVP
- [ ] Calendar export (e.g. .ics or "Add to Google Calendar" link)

#### 5. Templates
- [ ] Pre-made starter templates (e.g., BBQ, Potluck, Camping, Apartment Move-in)
- [ ] Option to create an event from a template (pre-populating the suggestion list)

#### 6. Push / In-App Notifications
- [ ] Notification system for items unchosen before event date
- [ ] Upcoming event reminders
- [ ] Suggestion on where to purchase items

#### 7. Clean-up & Polish
- [ ] Remove unused starter code (score route, example components, etc.)
- [ ] Responsive UI styling polish

---

## Home Page Design Ideas & Layout Sketches

### Core Theme & Style Guidelines
- **Palette**: Warm olive primary (`#57731A`), terracotta accent (`#BF7C41`), slate blue secondary (`#6C8EB1`), crisp white glassmorphism cards (`bg-white/90 backdrop-blur-sm`).
- **Header**: Left-justified `WhatToBring` brand, right-aligned Notification Bell (with unread counter) and User Avatar profile menu with sign-out.

---

### Key User Actions

1. **`[ + Create New Event ]`**
   - Launches a modal to input: Event Name, Date & Time (using our Calendar component), Location, Description, and a toggle: *"Allow guests to add item suggestions"*.
   - Option to launch blank or choose a template directly.
2. **`[ Browse Templates ]`**
   - Opens a visual catalog of pre-made event templates (e.g., *Summer BBQ*, *Friendsgiving*, *Camping Trip*, *Apartment Move-In*).
   - Each template includes a ready-to-go list of suggested items with default counts and categories (Food, Drinks, Supplies, Equipment).
3. **`[ See Upcoming Events ]`**
   - Two cohesive views:
     - **Calendar View**: Days with events show colored indicator dots; clicking a date highlights the events on that day.
     - **Timeline / Card Feed**: Chronological cards showing what's happening next, where it is, and your assigned items.

---

### Selected Home Page Layout: Hybrid Command Center & Active Events Feed

Combines the interactive Calendar and Command Center structure with the rich event cards from Concept 2, featuring a 3-event paginated view and a dedicated Host Guest List manager.

```
+---------------------------------------------------------------------------------------------------------+
| WhatToBring                    [ + Create New Event ]  [ 📁 Browse Templates ]    (Bell: 2)  [Avatar]   |
+---------------------------------------------------------------------------------------------------------+
|                                                                                                         |
|  Welcome back, Nora! 👋                                                                                 |
|  Manage your events, coordinate who is bringing what, and invite guests.                                |
|                                                                                                         |
|  +-----------------------------+  +------------------------------------------------------------------+  |
|  |       EVENT CALENDAR        |  |  UPCOMING & ACTIVE EVENTS            [ 📅 See All Events (5) ]   |  |
|  |  <        Oct 2026        > |  |  Showing 1 - 3 of 5 events                  [ < Prev ] [ Next > ]|  |
|  |  Su  Mo  Tu  We  Th  Fr  Sa |  |                                                                  |  |
|  |          1   2   3   4   5  |  |  +------------------------------------------------------------+  |  |
|  |   6   7   8   9  10  11  12* |  |  | 🏕️ Camping Trip (In 3 days)         👑 HOST  | 📍 The woods |  |  |
|  |  13  14  15  16  17  18  19  |  |  | Oct 12, 2026 • 4 Guests • 4/6 Items Claimed [======---] 66%  |  |  |
|  |  20  21  22  23  24  25  26  |  |  | You're Bringing: ⛺ Tent (Large 4-person)                   |  |  |
|  |  27  28  29  30  31         |  |  | [ See Event Details -> ]                 [ + Invite Guests ]  |  |  |
|  |                             |  |  +------------------------------------------------------------+  |  |
|  |  * Dot indicates an event   |  |                                                                  |  |
|  |  (Click a date to filter)   |  |  +------------------------------------------------------------+  |  |
|  +-----------------------------+  |  | 🦃 Friends-giving (Next Month)     🤝 GUEST | 📍 146 West St. |  |  |
|                                   |  | Nov 26, 2026 • Host: Guest User • RSVP: Attending             |  |  |
|  +-----------------------------+  |  | Items Needed: 5 suggestions unassigned                        |  |  |
|  | 🎒 MY ITEMS CHECKLIST       |  |  | You're Bringing: [ Claim an Item from Suggestions -> ]        |  |  |
|  | Items assigned to you:      |  |  +------------------------------------------------------------+  |  |
|  | [x] ⛺ Tent (Camping Trip)  |  |                                                                  |  |
|  | [ ] 🥧 Pumpkin Pie (Potluck)|  |  +------------------------------------------------------------+  |  |
|  | [ ] 🥤 Soda Pack (Cookout)  |  |  | 🍔 Summer Cookout                   👑 HOST  | 📍 City Park |  |  |
|  |                             |  |  | Jul 4, 2026 • 8 Guests • 7/10 Items Claimed [=======---] 70%  |  |  |
|  |                             |  |  | You're Bringing: 🥩 Marinated Ribs                             |  |  |
|  +-----------------------------+  |  +------------------------------------------------------------+  |  |
|                                   |  Page 1 of 2  (Max 3 events per page)                            |  |
|                                   +------------------------------------------------------------------+  |
|                                                                                                         |
|  +---------------------------------------------------------------------------------------------------+  |
|  | 👥 GUEST ROSTER & RSVPs (Events I Host)                                                           |  |
|  | Select Event: [ Camping Trip ▼ ]                                     [ + Invite New Guest ]       |  |
|  | +-----------------------------------------------------------------------------------------------+ |  |
|  | | Guest Name        | RSVP Status       | Assigned Item                | Actions                | |  |
|  | |-------------------|-------------------|------------------------------|------------------------| |  |
|  | | Nora Cleary (You) | 👑 Host           | ⛺ Tent (1)                  | [Edit Assignment]      | |  |
|  | | Guest User        | ✅ Attending      | 🪵 Firewood (2 bundles)      | [Message] [Change Item]| |  |
|  | | Sarah Miller      | ⏳ Pending (Sent) | (None yet)                   | [Resend Invite]        | |  |
|  | | Alex Kim          | ❓ Maybe          | (None yet)                   | [Nudge]                | |  |
|  +---------------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------------+
```

---

### Component Breakdown for Implementation

1. **Top Action Bar**:
   - `[ + Create New Event ]`: Opens event creation dialog (Name, Date, Location, Description, Suggestion Permissions).
   - `[ 📁 Browse Templates ]`: Opens modal catalog of pre-built event setups (BBQ, Camping, Friendsgiving).
   - `[ 📅 See All Events ]`: Smoothly scrolls or focuses the Paginated Active Events feed.

2. **Paginated Active Events List**:
   - Maximum **3 event cards displayed per page** to keep the dashboard concise and prevent vertical sprawl.
   - Previous (`< Prev`) and Next (`Next >`) controls with page counter (`Page X of Y`).
   - Cards display:
     - Event Title, Date, Location, and Countdown ("In 3 days").
     - Role Badge: `👑 HOST` or `🤝 GUEST`.
     - Claim progress bar (`4/6 Items Claimed`).
     - What you are bringing badge (or a highlighted prompt: `Claim an Item`).
     - Deep-link button to open the event's detail page.

3. **Interactive Calendar (`react-day-picker`)**:
   - Highlights event dates with primary/accent dots.
   - Clicking a date filters the Active Events list to only events on that day, with a "Clear date filter" chip.

4. **"My Items Checklist" Card**:
   - Aggregates all items across all events where `assignedToId === currentUser.id`.
   - Includes interactive checkboxes so users can check off items as they pack or purchase them.

5. **"Guest Roster & RSVPs" Card (Replaced Template Inspiration)**:
   - Visible to hosts for the events they own.
   - Has a dropdown to select between their hosted events (e.g. Camping Trip vs Friendsgiving).
   - Shows guest attendance status (`Attending`, `Maybe`, `Declined`, `Pending`).
   - Shows what item each guest has claimed to bring.
   - Quick input or button to invite new guests by username.


