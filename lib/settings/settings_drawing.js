var settings_drawing = function(settings){

  // Drawing specific
  //settings.drawing = settings.drawing || {};


  var size = settings.drawing_settings.size = {};
  var loc = settings.drawing_settings.loc = {};


  // sizes
  size.sheet = {
    w: 1000,
    h: 772,
    frame_padding: 5,
    titlebox: {
      side: {
        w: 90,
        h: 80*3,
      },
      bottom: {
        h: 60,
        w: 850
      }
    }

  };

  size.module = {};
  size.module.frame = {
    w: 30,
    h: 45,
  };
  size.module.lead = 2;
  size.module.h = size.module.frame.h + size.module.lead*2;
  size.module.w = size.module.frame.w + size.module.lead*2;

  size.wire_offset = {
    base: 7,
    gap: size.module.w,
  };
  size.wire_offset.min = size.wire_offset.base * 1;


  size.string = {};
  size.string.gap = size.module.lead * 2;
  size.string.gap_missing = size.string.gap * 3
  //size.string.w = size.module.frame.w + size.module.lead*2;
  size.string.h = size.module.frame.h + size.module.lead*2;

  size.terminal_diam = 6;

  size.disconect = {};
  size.disconect.l = 20;

  size.fuse = {};
  size.fuse.l = size.disconect.l;
  size.fuse.w = 4;

  size.bus_bar = {
    w: 5
  };




  // Inverter
  loc.inverter = {
    x: size.sheet.w/2 + 100,
    y: 375
  };
  size.inverter = {
    w: 200,
    h: 150
  };
  size.inverter.text_gap = 15;
  size.inverter.symbol_w = 50;
  size.inverter.symbol_h = 25;

  loc.inverter.bottom = loc.inverter.y + size.inverter.h/2;
  loc.inverter.top = loc.inverter.y - size.inverter.h/2;
  loc.inverter.bottom_right = {
    x: loc.inverter.x + size.inverter.w/2,
    y: loc.inverter.y + size.inverter.h/2,
  };
  loc.inverter.left = loc.inverter.x - size.inverter.w/2;
  loc.inverter.left_terminal = loc.inverter.left + size.terminal_diam*2 + size.disconect.l;
  loc.inverter.right = loc.inverter.x + size.inverter.w/2;
  loc.inverter.right_terminal = loc.inverter.right - size.terminal_diam;





  var box_spacing = 40;

  // DC disconect
  size.DC_disconect = {
    w: 42,
    h: size.inverter.h,
  };
  loc.DC_disconect = {
    x: loc.inverter.left - box_spacing - size.DC_disconect.w/2 - 15,
    y: loc.inverter.bottom_right.y - size.DC_disconect.h/2
  };

  // DC combiner
  size.DC_combiner = {
    w: 60,
    h: 130,
    fuse_to_bus_spacing: 10
  };
  size.DC_combiner.components_width = size.fuse.l + size.DC_combiner.fuse_to_bus_spacing + size.bus_bar.w;

  loc.DC_combiner = {
    x: loc.inverter.left - box_spacing - size.DC_combiner.w/2 - 25,
    y: loc.inverter.bottom_right.y - size.DC_combiner.h/2
  };



  // array
  loc.array = {
    //right: loc.inverter.x + 275,
    left: loc.DC_combiner.x - 275,
    lower: loc.inverter.y - 160,
    offset: 25
  };
  loc.array.upper = loc.array.lower;
  loc.DC_ground = {
    y: loc.inverter.bottom - size.terminal_diam*2
  };



  // DC junction box
  size.DC_jb_box = {
    w: 100,
    h: 30,
  };
  loc.DC_jb_box = {
    x: loc.array.left - loc.array.offset,
    y: loc.DC_combiner.y - size.DC_combiner.h/2 - size.DC_jb_box.h/2 + 10
  };





  // AC disconect
  size.AC_disc = {
    w: 42,
    h: 70
  };

  loc.AC_disc = {
    x: loc.inverter.x + size.inverter.w/2 + box_spacing + size.AC_disc.w/2 + 15,
    y: loc.inverter.bottom_right.y - size.AC_disc.h/2
  };
  //loc.AC_disc.bottom = loc.AC_disc.y + size.AC_disc.h/2;
  loc.AC_disc.top = loc.AC_disc.y - size.AC_disc.h/2;
  loc.AC_disc.bottom = loc.AC_disc.y + size.AC_disc.h/2;
  loc.AC_disc.left =  loc.AC_disc.x - size.AC_disc.w/2;
  loc.AC_disc.right = loc.AC_disc.x + size.AC_disc.w/2;
  loc.AC_disc.switch_top = loc.AC_disc.top + 15;
  loc.AC_disc.switch_bottom = loc.AC_disc.switch_top + 30;


  // AC load center
  size.AC_loadcenter = {
    w: 75,
    h: 125
  };
  loc.AC_loadcenter = {
    x: loc.AC_disc.x + size.AC_disc.w/2 + box_spacing + size.AC_loadcenter.w/2 + 25,
    y: loc.inverter.bottom - size.AC_loadcenter.h/2
  };
  loc.AC_loadcenter.left = loc.AC_loadcenter.x - size.AC_loadcenter.w/2;
  loc.AC_loadcenter.right = loc.AC_loadcenter.x + size.AC_loadcenter.w/2;
  loc.AC_loadcenter.top = loc.AC_loadcenter.y - size.AC_loadcenter.h/2;
  loc.AC_loadcenter.bottom = loc.AC_loadcenter.y + size.AC_loadcenter.h/2;

  size.AC_loadcenter.neutralbar = { w:5, h:40 };
  loc.AC_loadcenter.neutralbar = {
    x: loc.AC_loadcenter.right - size.terminal_diam*2,
    y: loc.AC_loadcenter.bottom - 40/2 - size.terminal_diam*2
  };

  size.AC_loadcenter.groundbar = { w:20, h:5 };
  loc.AC_loadcenter.groundbar = {
    x: loc.AC_loadcenter.x - 20,
    y: loc.AC_loadcenter.bottom - size.terminal_diam*2
  };









  // wire table
  loc.wire_table = {
    //x: loc.DC_jb_box.x - size.DC_jb_box.w/2 - 30,
    //y: loc.DC_jb_box.y + size.DC_jb_box.h/2 + 75
    x: 23,
    y: loc.inverter.y + 150
  };







  // system_spec_box
  size.system_spec_box = {};
  size.system_spec_box.w = 150;
  size.system_spec_box.h = 100;
  loc.system_spec_box = {};
  loc.system_spec_box.x = size.system_spec_box.w/2 + 30;
  loc.system_spec_box.y = size.system_spec_box.h/2 + 30;




  settings.pages = {};
  settings.pages.letter = {
    units: 'inches',
    w: 11.0,
    h: 8.5,
  };

  settings.pages.PDF = {
    w: settings.pages.letter.w * 72,
    h: settings.pages.letter.h * 72,
  };

  settings.pages.PDF.scale = {
    x: settings.pages.PDF.w / settings.drawing_settings.size.sheet.w,
    y: settings.pages.PDF.h / settings.drawing_settings.size.sheet.h,
  };

  if( settings.pages.PDF.scale.x < settings.pages.PDF.scale.y ) {
    settings.pages.letter.scale = settings.pages.PDF.scale.x;
  } else {
    settings.pages.letter.scale = settings.pages.PDF.scale.y;
  }


  loc.preview = loc.preview || {};
  loc.preview.array = loc.preview.array = {};
  loc.preview.array.top = 100;
  loc.preview.array.left = 50;

  loc.preview.DC = loc.preview.DC = {};
  loc.preview.inverter = loc.preview.inverter = {};
  loc.preview.AC = loc.preview.AC = {};

  size.preview = size.preview || {};
  size.preview.module = {
    w: 15,
    h: 25,
  };
  size.preview.DC = {
    w: 30,
    h: 50,
  };
  size.preview.inverter = {
    w: 150,
    h: 75,
  };
  size.preview.AC = {
    w: 30,
    h: 50,
  };
  size.preview.loadcenter = {
    w: 50,
    h: 100,
  };



  return settings;

};

module.exports = settings_drawing;
