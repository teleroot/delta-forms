import {format} from "../utilities/string-format";

export let messages = {
    required: "This field is required.",
    // remote: "Please fix this field.",
    email: "Please enter a valid email address.",
    url: "Please enter a valid URL.",
    date: "Please enter a valid date.",
    dateISO: "Please enter a valid date (ISO).",
    number: "Please enter a valid number.",
    integer: "Please enter a valid integer.",
    digits: "Please enter only digits.",
    equalTo: "Please enter the same value again.",
    maxlength: format( "Please enter no more than {0} characters." ),
    minlength: format( "Please enter at least {0} characters." ),
    rangelength: format( "Please enter a value between {0} and {1} characters long." ),
    range: format( "Please enter a value between {0} and {1}." ),
    max: format( "Please enter a value less than or equal to {0}." ),
    min: format( "Please enter a value greater than or equal to {0}." ),
    step: format( "Please enter a multiple of {0}." )
};
