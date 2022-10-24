jQuery.each( ["put", "delete" ], function( i, method ) {
    jQuery[ method ] = function( url, data, callback, type ){
        if ( jQuery.isFunction( data )) {
            type = type || callback;
            callback = undefined;
        }

        return jQuery.ajax({
            url: url,
            type: method,
            dataType: type,
            data: data,
            success: callback
        });
    };
});