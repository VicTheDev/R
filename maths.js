function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getPercentage(percent){
    return getRandomInt(0,100) < percent
}

function removeItem(array, item) {
    var i = array.length;

    while (i--) {
        if (array[i] === item) {
            array.splice(array.indexOf(item), 1);
        }
    }
    return array;
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function closestinRange(value, range){
    const closest = range.reduce( 
        (accumulator, currentValue) => 
        Math.abs(accumulator-value)<Math.abs(currentValue-value)?accumulator:currentValue,
        0
    );
    return closest;
}

module.exports = {getRandomInt,removeItem,getPercentage,capitalizeFirstLetter,closestinRange};