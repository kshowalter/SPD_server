var mk_sheet = function(settings, sheet_info){
    var f = settings.f;
    //logger.info("** Making page "+sheet_info.num);

    //var page_maker = require()

    var d = f.Drawing(settings);
    d.size = settings.drawing_settings.size.sheet;

    d.append(f.mk_border(settings, sheet_info ));

    if( settings.f.mk_sheet_num[sheet_info.sheet_id] !== undefined ){
        //logger.info('Sheet defined');
        //d.append( settings.f.mk_sheet_num[sheet_info.num](settings) );
        d.append( settings.f.mk_sheet_num[sheet_info.sheet_id](settings) );
    } else {
        //logger.error('Sheet not defined');
    }

    return d;
};

module.exports = mk_sheet;
