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



    SELECT * FROM pvsystem_details WHERE device_id = 37
    SELECT * FROM pvsystem_modules_view WHERE pvsystem_id = 37
    SELECT * FROM pvsystem_inverters_view WHERE pvsystem_id = 37

    SELECT
      *
    FROM
      pvsystem_details
    INNER JOIN pvsystem_modules_view
    ON pvsystem_modules_view.pvsystem_id = pvsystem_details.device_id
    INNER JOIN pvsystem_inverters_view
    ON pvsystem_inverters_view.pvsystem_id = pvsystem_details.device_id
    WHERE
      pvsystem_details.device_id = 37
