import { pool } from "./index";

export const runDatabaseMigrations = async (): Promise<void> => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id text PRIMARY KEY,
      email text NOT NULL UNIQUE,
      name text NOT NULL,
      role text NOT NULL CHECK (role IN ('user', 'organizer')),
      password_hash text NOT NULL,
      password_salt text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS organizer_profiles (
      user_id text PRIMARY KEY,
      bio text NOT NULL DEFAULT '',
      instagram text NOT NULL DEFAULT '',
      twitter text NOT NULL DEFAULT '',
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS banner_path text;

    ALTER TABLE users
      ADD COLUMN IF NOT EXISTS banner_revision integer NOT NULL DEFAULT 0;

    CREATE TABLE IF NOT EXISTS published_events (
      id text PRIMARY KEY,
      title text NOT NULL,
      date text NOT NULL,
      time text NOT NULL,
      location text NOT NULL,
      full_address text NOT NULL,
      description text NOT NULL,
      image text NOT NULL,
      attendees integer NOT NULL DEFAULT 0,
      category text NOT NULL,
      available integer NOT NULL,
      total integer NOT NULL,
      organizer text NOT NULL,
      organizer_id text NOT NULL,
      is_verified_organizer boolean NOT NULL DEFAULT false,
      tags text[] NOT NULL DEFAULT '{}',
      amenities text[] NOT NULL DEFAULT '{}',
      price numeric(10, 2) NOT NULL DEFAULT 0,
      currency text NOT NULL DEFAULT 'USD',
      purchase_limit_per_account integer,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS ticket_purchases (
      account_id text NOT NULL,
      event_id text NOT NULL,
      quantity integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (account_id, event_id)
    );

    INSERT INTO published_events (
      id, title, date, time, location, full_address, description, image,
      attendees, category, available, total, organizer, organizer_id,
      is_verified_organizer, tags, amenities, price, currency,
      purchase_limit_per_account
    ) VALUES
      (
        '1', 'Bass Drop Festival 2024', 'March 15, 2024', '9:00 PM',
        'Miami Beach Arena', '1901 Biscayne Blvd, Miami, FL 33132',
        'Get ready for the ultimate electronic music experience! Bass Drop Festival brings together the hottest DJs and producers for a night of non-stop dancing under the Miami stars.',
        'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=1200&h=600&fit=crop',
        2500, 'Music Festival', 150, 500, 'Bass Events Miami', 'org-bass',
        true, ARRAY['Electronic', 'Dance', 'Festival', 'Miami'],
        ARRAY['Food Trucks', 'Premium Bar', 'Valet Parking', 'Free WiFi', '24/7 Security'],
        89, 'USD', 4
      ),
      (
        '2', 'Digital Art Rave', 'March 22, 2024', '10:00 PM',
        'Brooklyn Warehouse, NYC', '56 Water St, Brooklyn, NY 11201',
        'An immersive night where digital art meets electronic music. Stunning projection mapping, generative visuals, and underground DJs create a one-of-a-kind sensory experience.',
        'https://images.unsplash.com/photo-1500673922987-e212871fec22?w=1200&h=600&fit=crop',
        800, 'Art & Culture', 0, 200, 'Digital Art Collective', 'org-digitalart',
        false, ARRAY['Art', 'Electronic', 'Immersive', 'NYC'],
        ARRAY['Projection Mapping', 'Open Bar', 'Gallery Installations', 'Live Art'],
        48, 'USD', NULL
      ),
      (
        '3', 'Tech Innovation Summit', 'March 28, 2024', '9:00 AM',
        'Silicon Valley Convention Center', '5001 Great America Pkwy, Santa Clara, CA 95054',
        'Meet the founders, engineers, and investors shaping the next generation of technology. This full-day summit features practical talks, product demos, and focused networking sessions.',
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
        1200, 'Tech & Networking', 300, 400, 'Tech Events Network', 'org-techevents',
        true, ARRAY['Technology', 'Startups', 'Networking', 'Innovation'],
        ARRAY['Coffee & Lunch', 'Founder Lounge', 'Fast WiFi', 'Demo Hall'],
        240, 'USD', NULL
      )
    ON CONFLICT (id) DO NOTHING;

    UPDATE published_events
      SET attendees = total - available
      WHERE id IN ('1', '2', '3')
        AND attendees <> total - available;
  `);
};