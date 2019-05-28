export var getPassiveOptions = function (passive) {
    if (passive === void 0) { passive = true; }
    try {
        var check = function () { return null; };
        window.addEventListener('testPassive', check, { passive: passive });
        window.removeEventListener('testPassive', check);
        return { passive: passive };
    }
    catch (e) {
        return false;
    }
};
