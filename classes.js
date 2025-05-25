export class ProgramType {
    constructor(name, airplaneType, hotelType) {
        this.name = name;
        this.airplaneType = airplaneType;
        this.hotelType = hotelType;
    }
}

const ServiceType = {
    Airplane: 0,
    Hotel: 1,
    Transfer: 2,
    Tour: 3,
    TourLeader: 4,
    Other: 5
};

export class Program {
    constructor(name) {
        this.name = name;
        this.days = [];
        this.defineProgramTypes();
    }

    defineProgramTypes() {
        this.programTypes = [
            new ProgramType('Individual', 'adult', 'single'),
            new ProgramType('Couple', 'adult', 'double'),
            new ProgramType('Family', 'adult', 'triple'),
        ];
    }

    getInfo() {
        return `${this.name} - ${this.days.length} days`;
    }

    addDay() {
        this.days.push(new Day());
    }

    removeDay(index) {
        var result = []

        for(var i = 0; i< this.days.length - 1; i++){
            if(i< index){
                result[i] = this.days[i];
                
            }else{
                result[i] = this.days[i + 1];
            }
        }   

        this.days = result;
    }

    addService(day, name, type){
        if(day < 0 || day >= this.days.length)
            throw new Error(`Day isn't included in the Schedule: ${day} in ${this.days.length}`);

        this.days[day].services.push(new Service(name, type));
    }

    removeService(day, index){
        
        if(day < 0 || day >= this.days.length)
            throw new Error(`Day isn't included in the Schedule: ${day} in ${this.days.length}`);

        if(index < 0 || this.days[day].services.length <= index)
            throw new Error(`Service isn't included in that Day: ${index} in ${this.days[day].services.length}`);
        
        this.days[day].removeService(index);
    }
}


export class Day {
    constructor() {
        this.services = [];
    }

    addActivity(activity) {
        this.services.push(activity);
    }

    removeService(index) {
        let result =[];

        for(var i = 0; i< this.services.length - 1; i++){
            if(i< index){
                result[i] = this.services[i];
            }else{
                result[i] = this.services[i + 1];
            }
        }   
        this.services = result;
    }
}

export class Service {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }

    getPrice(date, programType) {
        for (let season of this.subseasons) {
            if (date >= season.startDate && date <= season.endDate) {
                return season.getPrice(programType);
            }
        }
        throw new Error(`No season found for ${this.name} on ${date}`);
    }

    getPriceInterval(startDate, endDate, programType) {
        let totalPrice = 0;
        let currentDate = startDate;
        while (currentDate <= endDate) {
            totalPrice += this.getPrice(currentDate, programType);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return totalPrice;
    }
}

export class Season {
    constructor(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }
}

export class AirplaneSeason extends Season {
    constructor(startDate, endDate, adultPrice, childPrice, infantPrice, tourLeaderPrice, taxPrice) {
        super(startDate, endDate);
        this.adultPrice = adultPrice;
        this.childPrice = childPrice;
        this.infantPrice = infantPrice;
        this.tourLeaderPrice = tourLeaderPrice;
        this.taxPrice = taxPrice;
    }

    getPrice(type) {
        switch (type.airplaneType) {
            case 'adult': return this.adultPrice;
            case 'child': return this.childPrice;
            case 'infant': return this.infantPrice;
            case 'tourLeader': return this.tourLeaderPrice;
            case 'tax': return this.taxPrice;
            default:
                throw new Error(`Invalid Airplane Type ${type}`);
        }
    }
}

export class HotelSeason extends Season {
    constructor(startDate, endDate, singlePrice, doublePrice, triplePrice, childPrice, infantPrice, extraPrice) {
        super(startDate, endDate);
        this.singlePrice = singlePrice;
        this.doublePrice = doublePrice;
        this.triplePrice = triplePrice;
        this.childPrice = childPrice;
        this.infantPrice = infantPrice;
        this.extraPrice = extraPrice;
    }

    getPrice(type) {
        switch (type.hotelType) {
            case 'single': return this.singlePrice;
            case 'double': return this.doublePrice;
            case 'triple': return this.triplePrice;
            case 'child': return this.childPrice;
            case 'infant': return this.infantPrice;
            case 'extra': return this.extraPrice;
            default:
                throw new Error(`Invalid Hotel Type ${type}`);
        }
    }
}