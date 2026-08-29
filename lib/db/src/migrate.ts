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
  `);
};