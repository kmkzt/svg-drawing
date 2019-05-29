export var svgFormatting = function (svgXML) {
    var doc = typeof svgXML === 'string'
        ? new DOMParser().parseFromString(svgXML, 'image/svg+xml')
        : svgXML;
    var svgEle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var originSvgEle = doc.querySelector('svg');
    if (!originSvgEle)
        return svgEle;
    ['width', 'height', 'viewBox'].map(function (attr) {
        var attrValue = originSvgEle.getAttribute(attr);
        if (attrValue)
            svgEle.setAttribute(attr, attrValue);
    });
    var pathEle = doc.querySelectorAll('path');
    pathEle.forEach(function (path) {
        path.removeAttribute('transform');
        svgEle.appendChild(path);
    });
    return svgEle;
};
