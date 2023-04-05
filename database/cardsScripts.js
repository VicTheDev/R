const cards = require('./cards.json')
function cardsEffects(tour, other, skill){
    switch (skill){
        case 3:
            return Barde(tour,other);
        case 4:
            return Mage(tour,other);
        case 5:
            return Demon(tour,other);
        case 6:
            return Arach(tour,other);
        case 7:
            return Dragon(tour,other);
        case 8:
            return Cavalier(tour,other);
        case 9:
            return Gardien(tour, other);
        case 11:
            return Chevalier(tour,other);
    }
}

function Barde(tour, other){
    const healpoints = cards.find(x=>x.id==3).effect
    if(healpoints+tour.vie<tour.viemax){
        tour.vie += healpoints
    }else{
        tour.vie = tour.viemax
    }
    return[tour, other]
}

function Mage(tour, other){
   other.canatk = false;
   other.debuffs.push([3, "canatk", true, 'set'])
   return [tour,other]
}

function Demon(tour, other){
    const multiplier = cards.find(x=>x.id==5).effect;
    tour.buffs.push([4, "atk", multiplier, 'divide'])
    tour.atk = multiplier*tour.atk;
    return[tour, other];
}

function Arach(tour, other){
    other.canusecard = false;
    other.debuffs.push([3, "canusecard", true, 'set'])
    return[tour, other];
} 

function Dragon(tour, other){
    const damages = cards.find(x=>x.id==7).effect;
    if(other.vie-damages < 0){
        other.vie = 0
    }else{
        other.vie = Number((other.vie - damages).toFixed(2))
    }
    return[tour, other];
}

function Cavalier(tour, other){
    tour.thorns = cards.find(x=>x.id==8).effect
    tour.buffs.push([4,"thorns",0,'set'])
    return[tour, other]
}

function Gardien(tour, other){
    const multiplier = cards.find(x=>x.id==9).effect;
    tour.atk = tour.atk/multiplier;
    tour.def = tour.def*multiplier;
    //tour.mana -= cards.find(x=>x.id==9).mana
    return[tour, other]
}

function Chevalier(tour, other){
    const multiplier = cards.find(x=>x.id==11).effect
    other.debuffs.push([3,"def",(other.def-(other.def/multiplier)),'inc'])
    other.def /= 2
    return([tour, other])
}
module.exports = {cardsEffects}