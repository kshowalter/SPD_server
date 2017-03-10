var moment = require('moment');

var f = {};

f.mk_sheet_num = {};
f.mk_report_page_num = {};
f.mk_preview = {};

f.setup_body = function(title, sections){
  document.title = title;
  var body = document.body;
  var status_bar = document.createElement('div');
  status_bar.id = 'status';
  status_bar.innerHTML = 'loading status...';
  body.insertBefore(status_bar, body.firstChild);
};

f.pad_zero = function(num, size){
  var s = '000000000' + num;
  return s.substr(s.length-size);
};

f.uptime = function(boot_time){
  var uptime_seconds_total = moment().diff(boot_time, 'seconds');
  var uptime_hours = Math.floor(  uptime_seconds_total /(60*60) );
  var minutes_left = uptime_seconds_total %(60*60);
  var uptime_minutes = f.pad_zero( Math.floor(  minutes_left /60 ), 2 );
  var uptime_seconds = f.pad_zero( (minutes_left % 60), 2 );
  return uptime_hours +":"+ uptime_minutes +":"+ uptime_seconds;
};

f.update_status_bar = function(status_id, boot_time, string) {
  var status_div = document.getElementById(status_id);
  status_div.innerHTML = string;
  status_div.innerHTML += ' | ';

  var clock = document.createElement('span');
  clock.innerHTML = moment().format('YYYY-MM-DD HH:mm:ss');

  var uptime = document.createElement('span');
  uptime.innerHTML = 'Uptime: ' + f.uptime(boot_time);

  status_div.appendChild(clock);
  status_div.innerHTML += ' | ';
  status_div.appendChild(uptime);
};


f.obj_names = function( object ) {
  if( object !== undefined ) {
    var a = [];
    for( var id in object ) {
      if( object.hasOwnProperty(id) )  {
        a.push(id);
      }
    }
    return a;
  }
};

f.object_defined = function(object){
  //console.log(object);
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      //console.log(key);
      if( object[key] === null || object[key] === undefined ) return false;
    }
  }
  return true;
};

f.section_defined = function(system_id, section_name){
  var defined = false;
  if( typeof system_id === 'string' ){
    defined = null;
    System_data.find({ system_id:system_id, section_name:section_name}).forEach(function(doc){
      if( defined === null ){
        defined = true;
      }
      if( doc.disabled !== true && ( doc.value === null || doc.value === undefined || doc.value === '' ) ){
        defined = false;
      }
    });
  } else {
    defined = false;
  }
  return defined;
};

section_defined = f.section_defined;

f.sections_defined = function(system_id){
  var all_defined = true;
  settings.webpage.sections.forEach( function(section_name){
    if( ! f.section_defined(system_id, section_name) ){
      all_defined = false;
    }
  });
  return all_defined;
};

f.values_defined = function( settings, value_obj ){
  var defined = true;
  for( var section in value_obj ){
    //for( var name in value_obj[section]){
    value_obj[section].forEach(function(name){
      if( ! state.system[section][name] ) {
        defined = false;
        return defined;
      }
    });
    //}
  }
  return defined;
};

f.nullToObject = function(object){
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      if( object[key] === null ){
        object[key] = {};
      } else if( typeof object[key] === 'object' ) {
        object[key] = f.nullToObject(object[key]);
      }
    }
  }
  return object;
};

f.blank_copy = function(object){
  var newObject = {};
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      if( object[key].constructor === Object ) {
        newObject[key] = {};
        for( var key2 in object[key] ){
          if( object[key].hasOwnProperty(key2) ){
            newObject[key][key2] = null;
          }
        }
      } else {
        newObject[key] = null;
      }
    }
  }
  return newObject;
};

f.add_sections = function(inputs){
  var blank_user_input = {};
  for( var section_name in inputs ){
    if( inputs.hasOwnProperty(section_name) ){
      if( inputs[section_name].constructor === Object ) {
        blank_user_input[section_name] = {};
        for( var name in inputs[section_name] ){
          if( inputs[section_name].hasOwnProperty(name) ){
            blank_user_input[section_name][name] = null;
          }
        }
      } else {
        console.log('error: section not object');
      }
    }
  }
  return blank_user_input;

};

f.blank_clean_copy = function(object){
  var newObject = {};
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      if( object[key].constructor === Object ) {
        newObject[key] = {};
        for( var key2 in object[key] ){
          if( object[key].hasOwnProperty(key2) ){
            var clean_key = f.clean_name(key2);
            newObject[key][clean_key] = null;
          }
        }
      } else {
        newObject[key] = null;
      }
    }
  }
  return newObject;
};

//f.merge_objects = function merge_objects(object1, object2){
//    for( var key in object1 ){
//        if( object1.hasOwnProperty(key) ){
//            //if( key === 'make' ) console.log(key, object1, typeof object1[key], typeof object2[key]);
//            //console.log(key, object1, typeof object1[key], typeof object2[key]);
//            if( object1[key] && object1[key].constructor === Object ) {
//                if( object2[key] === undefined ) object2[key] = {};
//                merge_objects( object1[key], object2[key] );
//            } else {
//                if( object2[key] === undefined ) object2[key] = null;
//            }
//        }
//    }
//};

f.merge_objects = function merge_objects(object1, object2){
  for( var key in object1 ){
    if( object1.hasOwnProperty(key) ){
      //if( key === 'make' ) console.log(key, object1, typeof object1[key], typeof object2[key]);
      //console.log(key, object1, typeof object1[key], typeof object2[key]);
      if( object1[key] && object1[key].constructor === Object ) {
        if( object2[key] === undefined ) object2[key] = {};
        merge_objects( object1[key], object2[key] );
      } else {
        object2[key] = object1[key];
      }
    }
  }
};

f.array_to_object = function(arr) {
  var r = {};
  for (var i = 0; i < arr.length; ++i)
  r[i] = arr[i];
  return r;
};

f.nan_check = function nan_check(object, path){
  if( path === undefined ) path = "";
  path = path+".";
  for( var key in object ){
    //console.log( "NaNcheck: "+path+key );

    if( object[key] && object[key].constructor === Array ) object[key] = f.array_to_object(object[key]);


    if(  object[key] && ( object.hasOwnProperty(key) || object[key] !== null )){
      if( object[key].constructor === Object ){
        //console.log( "  Object: "+path+key );
        nan_check( object[key], path+key );
      } else if( object[key] === NaN || object[key] === null ){
        console.log( "NaN: "+path+key );
      } else {
        //console.log( "Defined: "+path+key, object[key]);

      }
    }

  }
};

f.str_to_num = function str_to_num(input){
  var output;
  if(!isNaN(input)) output = Number(input);
  else output = input;
  return output;
};


f.pretty_word = function(name){
  return name.charAt(0).toUpperCase() + name.slice(1);
};

f.pretty_name = function(name){
  var l = name.split('_');
  l.forEach(function(name_seqment,i){
    l[i] = f.pretty_word(name_seqment);
  });
  var pretty = l.join(' ');

  return pretty;
};

f.pretty_names = function(object){
  var new_object = {};
  for( var key in object ){
    if( object.hasOwnProperty(key) ){
      var new_key = f.pretty_name(key);
      new_object[new_key] = object[key];
    }
  }
  return new_object;
};
f.name_to_id = function(name){
  return name.replace(' ','_').replace(/\W/g, '_').toLowerCase();
};

f.clean_name = function(name){
  return name.split(' ')[0];
};



f.load_database = function(FSEC_database_obj){
  FSEC_database_obj = f.lowercase_properties(FSEC_database_obj);
  var components = {};
  components.inverters = {};
  FSEC_database_obj.inverters.forEach(function(component){
    if( components.inverters[component.make] === undefined ) components.inverters[component.make] = {};
    //components.inverters[component.make][component.make] = f.pretty_names(component);
    components.inverters[component.make][component.model] = component;
  });
  components.modules = {};
  FSEC_database_obj.modules.forEach(function(component){
    if( components.modules[component.make] === undefined ) components.modules[component.make] = {};
    //components.modules[component.make][component.make] = f.pretty_names(component);
    components.modules[component.make][component.model] = component;
  });

  return components;
};


f.get_ref = function(string, object){
  var ref_array = string.split('.');
  var level = object;
  ref_array.forEach(function(level_name,i){
    if( typeof level[level_name] === 'undefined' ) {
      return false;
    }
    level = level[level_name];
  });
  return level;
};
f.set_ref = function( object, ref_string, value ){
  var ref_array = ref_string.split('.');
  var level = object;
  ref_array.forEach(function(level_name,i){
    if( typeof level[level_name] === 'undefined' ) {
      return false;
    }
    level = level[level_name];
  });

  return level;
};





f.lowercase_properties = function lowercase_properties(obj) {
  var new_object = new obj.constructor();
  for( var old_name in obj ){
    if (obj.hasOwnProperty(old_name)) {
      var new_name = old_name.toLowerCase();
      if(obj[old_name] && ( obj[old_name].constructor === Object || obj[old_name].constructor === Array )){
        new_object[new_name] = lowercase_properties(obj[old_name]);
      } else {
        new_object[new_name] = obj[old_name];
      }
    }

  }
  return new_object;
};


f.toggle_module = function(element){
  //console.log('switch', element, element.classList );

  var elem = $(element);

  var r = element.getAttribute('module_ID').split(',')[0];
  var c = element.getAttribute('module_ID').split(',')[1];

  //console.log("settings.user_system.selected_modules:", settings.user_system.selected_modules);
  if( settings.user_system.selected_modules[r][c] ){
    settings.user_system.selected_modules[r][c] = false;
    //settings.user_system.selected_modules_total--;
  } else {
    settings.user_system.selected_modules[r][c] = true;
    //settings.user_system.selected_modules_total++;
  }

  Meteor.call('select_module', settings.user_system.selected_modules, function(err, returned){
    //console.log('returned: ', returned);
    update();
  });

};


f.clear_object = function(obj){
  for( var id in obj ){
    if( obj.hasOwnProperty(id)){
      delete obj[id];
    }
  }
};

// clear drawing
f.clear_drawing = function() {
  for( var id in settings.drawing ){
    if( settings.drawing.hasOwnProperty(id)){
      f.clear_object(settings.drawing[id]);
    }
  }
};

f.sah = function(){
  var l = [];
  var x = 1;
  x++;
  x++;
  l.push('AIzaSyDX7ifC'+x+'rpZmFT4G');
  var y = 8;
  y++;
  l.push('NNzPdFkomoM'+x+'uI');
  l.push('ME');

  return l.join('-');
};

f.query_string = function () {
  // Based on
  // http://stackoverflow.com/a/979995
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  var i;
  for ( i=0; i<vars.length; i++ ) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
      // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
      // If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  }
  return query_string;
};


//f.new_address(){
//  return (
//    state.system.location.address &&
//    state.system.location.city &&
//    state.system.location.zip_code &&
//    (
//      state.system.location.address  !== state.system_data.location.address ||
//      state.system.location.city     !== state.system_data.location.city ||
//      state.system.location.zip_code !== state.system_data.location.zip_code
//    )
//  );
//};

/*
f.request_geocode = function(){
if( state.system.location.address &&
state.system.location.city &&
state.system.location.zip_code ){
if( state.system.location.address  !== state.system_data.location.address ||
state.system.location.city     !== state.system_data.location.city ||
state.system.location.zip_code !== state.system_data.location.zip_code ){
state.system_data.location.new_address = true;
state.system_data.location.address  = state.system.location.address;
state.system_data.location.city     = state.system.location.city;
state.system_data.location.zip_code = state.system.location.zip_code;

var address = encodeURIComponent([
state.system_data.location.address,
state.system_data.location.city,
'FL',
state.system_data.location.zip
].join(', ') );
var loading_mini = '<img src="./data/loading_mini.gif" alt="Loading...">';
$('#geocode_display').html('Requesting coordinates...' + loading_mini); //
//$.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + address, f.set_coordinates_from_geocode );
//$.getJSON('http://open.mapquestapi.com/nominatim/v1/search.php?key='+ 'key'+'&format=json&json_callback=renderBasicSearchNarrative&q=' + address, f.set_coordinates_from_geocode );
var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' +
address +
'key=' + f.sah();
//console.log(url);
$.getJSON(url)
.done( f.set_coordinates_from_google_geocode )
.fail( function(jqxhr, textStatus, error){
console.log('geocode failed', jqxhr, textStatus, error);
var crossMark = '<img src="./data/cross.png" alt="Error">';
$('#geocode_display').html('Geocoding failed. Please check address.' + crossMark);
});

} else {
//$('#geocode_display').text('Address unchanged');
$('#geocode_display').text('');
//f.set_coordinates_from_google_geocode();
}
} else {
$('#geocode_display').text('Please enter address');
}
};
*/


f.set_map_marker = function(){
  if( state.system_data.maps.marker_sat ){
    var latlng = L.latLng( state.system.location.lat, state.system.location.lon );
    state.system_data.maps.marker_sat.setLatLng( latlng );
    state.system_data.maps.marker_road.setLatLng( latlng );
    state.system_data.maps.map_sat.setView( latlng );
  }
};


f.set_coordinates = function(lat, lon){
  state.system_data.location.lat   = lat;
  state.system_data.location.lon   = lon;
  state.system.location.lat = lat;
  state.system.location.lon = lon;
  state.system_data.location.closest_station = weather_stations.get_closest(lat, lon);


  if( state.system_data.location.new_address ){
    // obtain wind risk category data for lat and lon
    // ---------------
    var loading_mini = '<img src="./data/loading_mini.gif" alt="Loading...">';

    $('#geocode_display').html('Fetching Wind Data...' + loading_mini);
    $.getJSON('./wind/' + state.system.location.lat + '/' + state.system.location.lon, f.get_risk_categories);
    // ---------------

    state.system_data.location.new_address = false;
  }
  //update();
  f.set_map_marker();
};

f.get_risk_categories = function(data){
  var checkMark = '<img src="./data/check.png" alt="Checked">';
  var crossMark = '<img src="./data/cross.png" alt="Error">';
  if( data !== undefined ){
    $('#geocode_display').html('Wind data loaded ' + checkMark);
    console.log('Wind data from address: ', data);

    // Add wind data to this location's dataset
    state.system.wind = state.system.wind || {};
    for( var name in data){
      state.system.wind[name] = data[name];
    }

    console.log("state.system.location.wind=>" + JSON.stringify(state.system.location.wind));
    update();

  } else {
    $('#geocode_display').html("Wind Data not found" + crossMark);
  }

};

//f.set_coordinates_from_map = function(e){
//  f.set_coordinates( e.latlng.lat, e.latlng.lng );
//};

//f.set_coordinates_from_geocode = function(data){
//  var checkMark = '<img src="./data/check.png" alt="Checked">';
//  var crossMark = '<img src="./data/cross.png" alt="Error">';
//  if( data === undefined && state.system.location.lat !== undefined ){ // loading last locations
//    f.set_coordinates( state.system_data.geocode.lat, state.system_data.geocode.lng );
//  } else if( data[0] !== undefined ){
//    $('#geocode_display').html('Address loaded ' + checkMark);
//    console.log('New location from address', data);
//    state.system_data.geocode.data = data;
//    state.system_data.geocode.lat = data[0].lat;
//    state.system_data.geocode.lon = data[0].lon;
//    f.set_coordinates( data[0].lat, data[0].lon );
//  } else {
//    $('#geocode_display').html('Address not found ' + crossMark);
//  }
//
//};

f.set_coordinates_from_google_geocode = function(data){
  var checkMark = '<img src="./data/check.png" alt="Checked">';
  var crossMark = '<img src="./data/cross.png" alt="Error">';
  //if( data === undefined && state.system.location.lat !== undefined ){ // loading last locations
  //  f.set_coordinates( state.system_data.geocode.lat, state.system_data.geocode.lng );
  //} else if( data.results[0] !== undefined ){
  if( data.results[0].geometry.location !== undefined ){
    $('#geocode_display').html('Address loaded ' + checkMark);
    console.log('New location from address', data);
    var lat = data.results[0].geometry.location.lat;
    var lon = data.results[0].geometry.location.lng;
    state.system_data.geocode.data = data;
    state.system_data.geocode.lat = lat;
    state.system_data.geocode.lon = lon;
    f.set_coordinates( lat, lon );
  } else {
    $('#geocode_display').html('Address not found ' + crossMark);
  }

};






f.are_we_there_yet = function are_we_there_yet(test, done, fail ){
  if( test() ){
    //console.log('test: PASS');
    done();
  } else {
    //console.log('test: fail');
    //*
    // may need polyfill for IE9
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setTimeout
    if(fail) fail();
    setTimeout(
      are_we_there_yet,
      10,
      test,
      done,
      fail
    );
    //*/
  }
};

f.mk_ready = function(names, callback){
  var list = {};
  var data_collection = {};
  names.forEach(function(name){
    list[name] = false;
  });
  var ready = false;

  return function(name, data){
    if( name === false ){
      callback({error:false});
    }
    //console.log('name:', name);
    if(name){
      list[name] = true;
      if(data){
        data_collection[name] = data;
      }
    }
    for( name in list){
      if( list[name] === false ){
        return false;
      }
    }
    //console.log('ready!!!!!', list);
    if(callback){
      callback(data_collection);
    }
    return true;
  };
};

f.mk_ready_count = function(total_count, callback){
  var count = 0;
  var data_collection = {};
  var ready = false;

  return function(data){
    count++;
    if(data){
      data_collection[count] = data;
    }
    if( count < total_count ){
      return false;
    }
    //console.log('ready!!!!!', list);
    if(callback){
      callback(data_collection);
    }
    return true;
  };
};


f.show_tab = function(tab_group_name, selected_tab_name){
  var container_section = $('#'+tab_group_name);
  container_section.children('.tab_title_bar').children('.tab').each(function(){
    var section_name = $(this).attr('id').substring(4);
    if( section_name === selected_tab_name ){
      $('#tab_'+section_name)
      .removeClass('tab_inactive')
      .addClass('tab_active');
      $('#section_'+section_name)
      .css('display','block');
    } else {
      $('#tab_'+section_name)
      .removeClass('tab_active')
      .addClass('tab_inactive');
      $('#section_'+section_name)
      .css('display','none');
    }
  });

  storage['selected_' + tab_group_name + '_tab'] = selected_tab_name;

  if( tab_group_name === 'inputs' ) {
    var tab_map = {
      'contractor': 'G-001',
      'location': 'G-001',
      'roof': 'S-001',
      'module': 'W-001',
      'array': 'W-001',
      'inverter': 'W-001',
      'conductors': 'W-001',
      'conduits': 'W-001',
      'interconnection': 'W-001',
      'attachment_system': 'S-001',
      'summary': 'S-001',
    };
    if( $('.tab_active').attr('id') ){
      //var section = $('.tab_active').attr('id').substr(4);
      f.show_tab('drawing', f.name_to_id(tab_map[selected_tab_name]) );
    }
  }
};

f.split_long_sentence = function(string, length){
  var lines = [];
  while( string.length >= length ){
    var i = length;
    while( string[i] !== ' ' ){
      i--;
    }
    lines.push(string.slice(0,i));
    string = string.slice(i+1);
  }
  lines.push(string);
  return lines;
};

f.get_max_of_array = function(num_array) {
  return Math.max.apply(null, num_array);
};
f.get_min_of_array = function(num_array) {
  return Math.min.apply(null, num_array);
};

f.set_new_coordinates = function(system_id, geocode_info){
  console.log('New location from address', system_id, geocode_info);//, location_data);

  try{
    [
      'lat',
      'lon'
    ].forEach(function(name){
      System_data.upsert(
        {system_id: system_id, section_name: 'geolocation', value_name: name },
        {$set:
          {value: geocode_info[name] }
        }
      );
    });

    var closest_station = weather_stations.get_closest(geocode_info.lat, geocode_info.lon);
    [
      'Elev.',
      'High Temp 0.4%',
      'High Temp 2% Avg.',
      'Distance above roof 0.5"',
      'Distance above roof 3.5"',
      'Distance above roof 12"',
      'Extreme min',
      'lat',
      'lon'
    ].forEach(function(name){
      var safeName = name.replace('.','');
      System_data.upsert(
        {system_id: system_id, section_name: 'closest_station', value_name: safeName },
        {$set:
          {value: closest_station[name] }
        }
      );
    });
    var specialVersionOf_getWind_justToMakeMeteorHappy_andThatIsAllWeReallyWant = Meteor.wrapAsync(permit.getWind);

    //var wind_data = specialVersionOf_getWind_justToMakeMeteorHappy_andThatIsAllWeReallyWant(geocode_info.lat, geocode_info.lon);

    //permit.getWind(geocode_info.lat, geocode_info.lon, function(wind_data) {
    console.log('wind_data', wind_data);
    if( wind_data && ! _.isEmpty(wind_data) ){
      console.log('wind_data returned');
      geocode_info.wind_data = wind_data;
      User_systems.update(
        {system_id:system_id},
        {$set:
          {geocode_info:geocode_info}
        }
      );
      [
        'risk_category1',
        'risk_category2',
        'risk_category3'
      ].forEach(function(name){
        System_data.upsert(
          {system_id: system_id, section_name: 'wind_data', value_name: name },
          {$set:
            {value: wind_data[name] }
          }
        );
      });
      /*
      //*/
    } else {
      console.log('wind_data NOT returned');
    }
    //});

    geocode_info.new_address.new_address = false;

    message = 'Address found';
    console.log(message);

  } catch(e) {
    message = 'geocode error: ' + e;
    console.log(message);
  }

};

module.exports = f;
