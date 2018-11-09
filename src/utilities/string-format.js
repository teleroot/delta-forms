export function format(source, ...params) {
    if (arguments.length===1) {
        return function(...innerParams) {
            innerParams.unshift( source );
            // eslint-disable-next-line no-invalid-this
            return format.apply( this, innerParams);
        };
    }
    if ( params === undefined ) {
        return source;
    }
    if ( params.constructor !== Array ) {
        params = [params];
    }
    params.forEach((n, i)=>{
        source = source.replace( new RegExp( "\\{" + i + "\\}", "g" ), function() {
            return n;
        } );
    });

    return source;
}

