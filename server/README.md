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
