let tagsToReplace = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;"
};


let replaceTag = function(tag) {
    return tagsToReplace[tag] || tag;
};

export function stripHtmlTags(str) {
    return str.replace(/[&<>]/g, replaceTag);
}
