## API

### URLs
The base URL, or host, is represented as [host] below. It will be something like: “http://10.173.64.209:3300/”.

[host]__/d/SVG?pv_system_id=__[system_id]

Runs the system calculations. If they pass it then creates the drawings.
Returns a status document that includes notes, warnings, and errors to the user, as wells as a copy of each SVG strings if they were created.

[host]__/d/PDF?pv_system_id=__[system_id]

Runs the system calculations. If they pass it then creates the drawings.
Generates the PDFs and saves them to the server as a file.
Returns a PDF of the drawing.

#### Dev URLs

To receive a response with a stock, working system configuration (NOT the system configuration from the database that matches your system_id), replace the /d/ in the URL with a /t/. This works for those listed above and below. You can view the stock data [here](https://github.com/kshowalter/SPD_server/blob/master/TEMP/DB_sample.json), or the /t/ version of the first URL below.

[host]__/d/db?pv_system_id=__[system_id]

Returns raw results from the database queries.

[host]__/d/data?pv_system_id=__[system_id]

Runs the system calculations. Returns the raw system values.

[host]__/d/SVG?pv_system_id=__[system_id]__&sheet_num=__[sheet number: 1,2]

Returns one page of the drawing wrapped in HTML, and suitable for browser viewing.


## Returned status document

    {
        'system_id': [database id?],
        'status': ['error', 'pass'],
        'notes': {
            'info': ['This might be of interest to you'],
            'warnings': ['Something is not perfect, but may be acceptable'],
            'errors': ['Something in the design failed. NO DRAWING.'],
        },
        'SVG_url': [link to API listed above],
        'PDF_url': [link to API listed above],
        'SVGs': {
          1: [SVG string?],
          2: [SVG string?],
          3: [SVG string?]
        },
        "PDF_file_name": [PDF filename string]

    }
