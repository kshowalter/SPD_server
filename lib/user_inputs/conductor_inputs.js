add_user_input_table = function(settings){
  settings.info = settings.info || {};
  settings.info.user_input_table = settings.info.user_input_table || {};

  /*
  settings.info.user_input_table.conductors = {
    name: 'conductors',
    row_names: [
      'Intermodule Wiring (DC+/DC-)',
      'Intermodule Wiring (EGC)',
      'PV DC Source Circuits (DC+/DC-)',
      'PV DC Source Circuits (EGC)',
      'PV DC Output Circuits (DC+/DC-)',
      'PV DC Output Circuits (EGC)',
      'Inverter AC Output Circuit (L1/L2)',
      'Inverter AC Output Circuit (N)',
      'Inverter AC Output Circuit (EGC)',
      'Feeder Circuit to Inverter Subpanel (L1/L2)',
      'Feeder Circuit to Inverter Subpanel (N)',
      'Feeder Circuit to Inverter Subpanel (EGC)',
      'Feeder Circuit to Inverter Subpanel (GEC)',
      'Main Service Equipment (L1/L2)',
      'Main Service Equipment (N)',
      'Main Service Equipment (EGC)',
      'Main Service Equipment (GEC)'
    ],
    input_types: {
      'Location':{
        type: 'select',
        options: [
          'Free Air/Exposed',
          'Conduit/Exterior',
          'Conduit/Interior'
        ]
      },
      'Minimum Size (AWG)':{
        type: 'select',
        options: [
          '12',
          '10',
          '8',
          '6',
          '4',
          '3',
          '2',
          '1',
          '1/0',
          '2/0',
          '3/0',
          '4/0',
          'racking'
        ],
      },
      'Material (CU/AL)':{
        type: 'select',
        options: [
          'CU',
          'AL'
        ],
        value: 'CU',
      },
      'Insulation/Type':{
        type: 'select',
        options: [
          'PV Wire',
          'THWN-2',
          'Bare'
        ],
      },
      'Voltage Rating (V)':{
        type: 'number_input',
        value: '600',
      },
      'Wet Temp Rating °C':{
        type: 'number_input',
        value: '90',
      },
      'Conductor Ampacity (A)': {
        type: 'number_input'
      },
     	'Strands': {
        type: 'number_input'
      },
      'Diam. (in)': {
        type: 'number_input'
      },
      'Qty':{
        type: 'number_input'
      }
    },
    col_defaults: {
      'Location': {
        'Intermodule Wiring (DC+/DC-)': 'Free Air/Exposed',
        'Intermodule Wiring (EGC)': 'Free Air/Exposed',
        'PV DC Source Circuits (DC+/DC-)': 'Conduit/Exterior',
        'PV DC Source Circuits (EGC)': 'Conduit/Exterior',
        'PV DC Output Circuits (DC+/DC-)': 'Conduit/Interior',
        'PV DC Output Circuits (EGC)': 'Conduit/Interior',
        'Inverter AC Output Circuit (L1/L2)': 'Conduit/Interior',
        'Inverter AC Output Circuit (N)': 'Conduit/Interior',
        'Inverter AC Output Circuit (EGC)': 'Conduit/Interior',
        'Feeder Circuit to Inverter Subpanel (L1/L2)': 'Conduit/Exterior',
        'Feeder Circuit to Inverter Subpanel (N)': 'Conduit/Exterior',
        'Feeder Circuit to Inverter Subpanel (EGC)': 'Conduit/Exterior',
        'Feeder Circuit to Inverter Subpanel (GEC)': 'Conduit/Exterior',
        'Main Service Equipment (L1/L2)': 'Conduit/Exterior',
        'Main Service Equipment (N)': 'Conduit/Exterior',
        'Main Service Equipment (EGC)': 'Conduit/Exterior',
        'Main Service Equipment (GEC)': 'Free Air/Exposed',
      },
      'Minimum Size (AWG)': {},
      'Material (CU/AL)': {},
      'Insulation/Type': {},
      'Voltage Rating (V)': {},
      'Wet Temp Rating °C': {},
      'Qty': {}
    }
  };
  */


  settings.info.user_input_table.conduits = {
    name: 'conduits',
    row_names: [
      'Intermodule Wiring',
      'PV DC Source Circuits',
      'PV DC Output Circuits',
      'Inverter AC Output Circuit',
      'Feeder Circuit to Inverter Subpanel',
      'Main Service Equipment',
    ],
    conduit_conductors: {
      'Intermodule Wiring': [
        'DC+/DC-',
        'EGC'
      ],
      'PV DC Source Circuits': [
        'DC+/DC-',
        'EGC'
      ],
      'PV DC Output Circuits': [
        'DC+/DC-',
        'EGC',
      ],
      'Inverter AC Output Circuit': [
        'L1/L2',
        'N',
        'EGC',
      ],
      'Feeder Circuit to Inverter Subpanel': [
        'L1/L2',
        'N',
        'EGC',
        'GEC',
      ],
      'Main Service Equipment': [
        'L1/L2',
        'N',
        'EGC',
        'GEC',
      ]
    },
    input_types: {
      'Type':{
        type: 'select',
        options: [
          'EMT',
          'PVC',
          'NA',
        ]
      },
      'Minimum Distance Above Roof (in)':{
        type: 'number_input'
      },
      'Temperature Adder °C':{
        type: 'number_input'

      },
      'Min Trade Size (in)':{
        type: 'number_input'

      },
      'Conduit Area 40% Fill (in2)':{
        type: 'number_input'

      },
    },
    col_defaults: {
      'Minimum Distance Above Roof (in)':{
        'Intermodule Wiring': 'NA',
        'PV DC Source Circuits': undefined,
        'PV DC Output Circuits': 'NA',
        'Inverter AC Output Circuit': 'NA',
        'Feeder Circuit to Inverter Subpanel': 'NA',
        'Main Service Equipment': 'NA',
      },
      'Min Trade Size (in)':{
        'Intermodule Wiring': 'NA'
      }
    }
  };


};
