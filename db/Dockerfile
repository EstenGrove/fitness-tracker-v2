FROM postgres:17

# Try to install pg_cron extension (may not be available in all repos)
# If it fails, the restore script will handle it gracefully
RUN apt-get update && \
    (apt-get install -y --no-install-recommends postgresql-17-cron || \
     echo "pg_cron package not available, will skip during restore") && \
    rm -rf /var/lib/apt/lists/*

