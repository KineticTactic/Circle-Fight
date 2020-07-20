module.exports.millis = () => {
    return new Date().getTime();
};

module.exports.constrain = (val, min, max) => {
    if (val < min) return min;
    else if (val > max) return max;
    else return val;
};
