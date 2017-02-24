# Oracle DB connection

# test queries

    SELECT sysdate FROM dual


You could use "from dual" to generate your own fake tables if you'd like. Example:

    SELECT
        1 as system_id,
        'Hello World' as example
    FROM
        dual

Or you can use:

    SELECT * FROM devices

If you want to pull actual data from an actual table. (devices likely has multiple rows at least)
