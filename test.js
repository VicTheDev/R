function test(def){
    let moy = 0
    for(let i = 0; i<100; i++){
        const value = Math.min(getRandomInt(20,60)/100*def, getRandomInt(30,55)/100*10+getRandomInt(5,10)/100*def)
        getRandomInt(80,110)/10
        moy = (moy+(getRandomInt(80,110)/10-value))/2
    }
    return(moy)
}
function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
let moy2 = []
for(let i = 0; i<50; i++){
    moy2.push(test(i))
}
const sorted = moy2.sort((a,b) => a-b)
console.log(moy2)