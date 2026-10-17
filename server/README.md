# FitnessTracker-v2 Docs

## Docker Commands & Utils

```bash
docker compose exec db psql -U x-main-user -d FitnessTracker-v2
```

## Database Backup & Restore (Local ENV)

**Backup:**
To backup the local database on your local machine it's likely best to navigate to the user root directory and run the backup_selected_dbs.sh script like so:

```bash
cd ~ && sh backup_selected_dbs.sh
```

**Restore PROD Data to Local DB Copy:**
To restore PRODUCTION data only into your local database copy on your local machine you simply need to switch to the '/server' directory and run a single command as follows:

```bash
cd server/ && npm run db:sync-prod
```

The above command will perform the following:

1. SSH into the PROD server
2. Create a backup of PROD (data only!)
3. Create a backup of Local ENV (data only!)
4. Download the PROD data backup via a stream to the local machine
5. Restore PROD's data directly into the Local ENV database, while leaving all functions, triggers, indices etc untouched!

## Database Migrations

Schema changes (tables, functions, views) live in `db/migrations/` as numbered `.sql` files and are applied by `db/scripts/migrate.sh`. Each database records what it has run in a `schema_migrations` table, so every file runs **once per database**, in filename order.

```bash
cd server/
npm run db:migrate:status          # local: list applied/pending (read-only)
npm run db:migrate                 # local: apply pending
npm run db:migrate -- --prod --status
npm run db:migrate -- --prod       # prod: confirm, back up, apply pending
```

**Prod:** `deploy.sh` checks for pending migrations first and stops if there are any. Run `./deploy.sh --migrate` to apply them before the new code is deployed (or `--skip-migrations` to bypass the check). Before applying, a full backup is saved on the server at `/var/backups/postgres/pre-migrate-<timestamp>.dump`.

**Writing a migration:**

1. Add the next number, eg. `db/migrations/005_add_something.sql`.
2. Make it safe to re-run: `CREATE OR REPLACE FUNCTION`, `CREATE TABLE IF NOT EXISTS`, `CREATE EXTENSION IF NOT EXISTS`, etc.
3. Don't add `BEGIN`/`COMMIT`. The script runs each file in one transaction: if anything fails, the whole file is rolled back and stays pending.
4. Never edit a file after it has been applied anywhere. It's reported as `CHANGED` and won't re-run; put the change in a new file.
5. Only add things (new tables, columns, functions). Code that's still running must keep working until the deploy finishes.

**A database that already has the objects** (eg. created by hand): either run the migrations normally (they're safe to re-run), or record them without running anything with `migrate.sh --baseline`.
