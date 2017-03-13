# Oracle DB connection
Current queries:

    SELECT * FROM pvsystem_details WHERE device_id = 37
    SELECT * FROM pvsystem_modules_view WHERE pvsystem_id = 37
    SELECT * FROM pvsystem_inverters_view WHERE pvsystem_id = 37
    SELECT
        device_id,
        certification_id,
        old_certification_number,
        company_id,
        name,
        line_1,
        line_2,
        line_3,
        city,
        state,
        zipcode,
        country,
        primary_phone_number,
        web_site,
        email
      FROM
        companies
        JOIN applications USING(company_id)
        JOIN application_devices USING(application_id)
        JOIN company_addresses USING(company_id)
        JOIN addresses USING(address_id)
        JOIN certification USING(device_id)
      WHERE
        certification_id = 37


If you want to pull actual data from an actual table. (devices likely has multiple rows at least)

Alternative query?

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

## Direct query
You can also access the tables directly using this query:

    /**************************************/
      SELECT
        device_details.manufacturer_name,
        device_details.device_model_number,
        device_details.device_name,
        pvmodule_prop.*,
        pvsystem_pvmodules.*
      FROM
        pvsystem_pvmodules
        INNER JOIN pvmodule_prop
        ON pvmodule_prop.device_id = pvsystem_pvmodules.pvmodule_id
        INNER JOIN device_details
        ON device_details.device_id = pvmodule_prop.device_id
        INNER JOIN device_status
        ON device_status.device_id = pvmodule_prop.device_id
      WHERE
        USER_CATEGORY_CODE = 'Employee'
        AND device_status.device_status_id = 402;
    /**************************************/


## Company

    /************************************************/
    SELECT
        device_id,
        certification_id,
        old_certification_number,
        company_id,
        name,
        line_1,
        line_2,
        line_3,
        city,
        state,
        zipcode,
        country,
        primary_phone_number,
        web_site,
        email
      FROM
        companies
        JOIN applications USING(company_id)
        JOIN application_devices USING(application_id)
        JOIN company_addresses USING(company_id)
        JOIN addresses USING(address_id)
        JOIN certification USING(device_id)
      WHERE
        certification_id = 24
    /************************************************/


You could also get the same result by looking it up using a different where clause using the old certification number:


    /************************************************/
      SELECT
        device_id,
        certification_id,
        old_certification_number,
        company_id,
        name,
        line_1,
        line_2,
        line_3,
        city,
        state,
        zipcode,
        country,
        primary_phone_number,
        web_site,
        email
      FROM
        companies
        JOIN applications USING(company_id)
        JOIN application_devices USING(application_id)
        JOIN company_addresses USING(company_id)
        JOIN addresses USING(address_id)
        JOIN certification USING(device_id)
      WHERE
        old_certification_number = 'QC14-NT90-0124'
    /************************************************/


Or like this:

    /************************************************/
      SELECT
        device_id,
        certification_id,
        old_certification_number,
        company_id,
        name,
        line_1,
        line_2,
        line_3,
        city,
        state,
        zipcode,
        country,
        primary_phone_number,
        web_site,
        email
      FROM
        companies
        JOIN applications USING(company_id)
        JOIN application_devices USING(application_id)
        JOIN company_addresses USING(company_id)
        JOIN addresses USING(address_id)
        JOIN certification USING(device_id)
      WHERE
        device_id = 475
    /************************************************/



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
