<p align="center">
  <img src="public/parcelflow-mark.svg" alt="ParcelFlow Brand Mark" width="100" height="100" />
</p>

<h1 align="center">ParcelFlow</h1>

<p align="center">
  <strong>Real-time courier dispatch and campus parcel delivery management system with live route status and automated rider notifications.</strong>
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Framework-Next.js%2015-black?logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" /></a>
</p>

---

## Overview

ParcelFlow is a purpose-built logistics dispatch platform designed to handle last-mile deliveries, parcel handoffs, and campus courier networks. It replaces paper logs and fragmented messaging with an operational command center that coordinates senders, dispatchers, riders, and recipients.

---

## Key Features

- **Live Dispatch Dashboard**: Real-time overview of active deliveries, rider allocations, parcel pickup queues, and completed drops.
- **Rider Allocation & Routing**: Smart assignment of packages to available campus runners and motorcycle couriers based on zone proximity.
- **Public Parcel Tracking**: Clean recipient tracking portal with live waypoint status (Received, Dispatched, In Transit, Delivered).
- **Proof of Delivery (PoD)**: Secure delivery confirmation via digital signature and one-time delivery verification PINs.
- **Multi-Role Access Control**: Granular permissions separating dispatch administrators, field riders, and end customers.
- **Automated Alerts**: Status triggers notifying recipients on dispatch and arrival via SMS and WhatsApp.

---

## Technical Architecture

- **Framework**: Next.js 15 utilizing Server Actions for streamlined mutation handling without boilerplate REST endpoints.
- **Real-Time Data**: Supabase Realtime WebSocket subscriptions keeping the dispatcher board synchronized as riders update drop status.
- **Database Architecture**: PostgreSQL schema with tables for `parcels`, `riders`, `dispatch_logs`, `zones`, and `tracking_events`.
- **UI & Interaction**: Tailwind CSS utility architecture paired with Framer Motion layout transitions for fluid state updates.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database & Realtime | Supabase (PostgreSQL + Realtime Channels) |
| Form Validation | React Hook Form / Zod |
| Icons | Lucide React |
| Styling | Tailwind CSS |

---

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/francisnaga/parcelflow.git
   cd parcelflow
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Launch development environment**:
   ```bash
   npm run dev
   ```

---

## Author

Francis Naga ([Portfolio](https://francisnaga.site) / [GitHub](https://github.com/francisnaga))

---

## License

MIT License. See [LICENSE](LICENSE) for details.
