export var svgFormatting = function (svgString) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(svgString, 'image/svg+xml');
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
