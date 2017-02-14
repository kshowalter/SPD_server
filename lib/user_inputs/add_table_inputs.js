add_table_inputs = function(section, section_name){
  var input_section = {};
  section.row_names.forEach(function(row_name){
    for( var col_name in section.input_types){
      var default_input_config = section.input_types[col_name];
      var input_config = {};
      for( var name in default_input_config ){
        input_config[name] = default_input_config[name];
      }
      input_config.note = row_name + ': ' + col_name;
      if( section.col_defaults[col_name] && section.col_defaults[col_name][row_name] ){
        input_config.value = section.col_defaults[col_name][row_name];
      }
      var value_name = f.name_to_id(row_name) + '_' + f.name_to_id(col_name);
      input_config.value_name = value_name;
      input_section[value_name] = input_config;
    }
  });

  process_user_input_section(input_section, section_name);

  return input_section;
};
