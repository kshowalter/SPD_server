## API

### URLs
The base URL, or host, is represented as [host] below. It will be something like: “http://10.64.53.89/”.

[host]__/d/__[system_id]__/check__

Runs the system calculations. Does not create the drawings.
Returns a status document that includes notes, warnings, and errors to the user.

[host]__/d/__[system_id]/__SVG__

Runs the system calculations, creates the drawings.
Returns a status document that includes notes, warnings, and errors to the user, as wells as a copy of each SVG page.

[host]__/d/__[system_id]__/SVG_page__

Runs the system calculations, creates the drawings.
Returns a HTML page containing the SVGS.
Used in development to test the output of the drawing generation.

[host]__/d/__[system_id]__/PDF__

Runs the system calculations, creates the drawings.
Returns a PDF of the drawing.


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
        }

    }
