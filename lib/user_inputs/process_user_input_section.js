var process_user_input_section = function(input_section, section_name){
  order = 0;
  for( var value_name in input_section){
    var input = input_section[value_name];
    if( input.options && ! input.type ){
      input.type = 'select';
    }
    if( input.options === 'TBD'){
      input.options = false;
    }
    if( ! input.disabled ){
      input.disabled = false;
    }
    input.value_name = value_name;
    input.section_name = section_name;
    input.value = input.value || null;
    input.category = "user_input";
    input.order = order++;
  }

};

module.exports = process_user_input_section;
