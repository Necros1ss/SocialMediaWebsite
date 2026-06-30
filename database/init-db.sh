#!/bin/bash
echo "Waiting for SQL Server to start..."

SQLCMD="/opt/mssql-tools18/bin/sqlcmd"
PARAMS="-S sqlserver -U sa -P YourStrong@Pass123 -C -f 65001"

# Loop to wait for SQL Server to be ready
for i in {1..50}; do
    $SQLCMD $PARAMS -Q "SELECT 1" &> /dev/null
    if [ $? -eq 0 ]; then
        echo "SQL Server is ready!"
        break
    fi
    echo "SQL Server is not ready yet (attempt $i). Retrying in 2 seconds..."
    sleep 2
done

echo "Initializing database schema and seeding data..."

$SQLCMD $PARAMS -i "/database/Schema CoreData.sql"
$SQLCMD $PARAMS -i "/database/Schema Messaging.sql"
$SQLCMD $PARAMS -i "/database/Schema Auditing.sql"
$SQLCMD $PARAMS -i "/database/Messaging Enhancement.sql"
$SQLCMD $PARAMS -i "/database/function&trigger.sql"
$SQLCMD $PARAMS -i "/database/seedDataCore.sql"
$SQLCMD $PARAMS -i "/database/seedDataMessaging.sql"
$SQLCMD $PARAMS -i "/database/insert.sql"

echo "Database initialization complete!"
