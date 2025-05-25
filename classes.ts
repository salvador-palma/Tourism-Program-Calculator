type AirplaneType = 'adult' | 'child' | 'infant' | 'tourLeader' | 'tax';
type HotelType = 'single' | 'double' | 'triple' | 'child' | 'infant' | 'extra';
export class ProgramType{

    name : string;
    airplaneType : AirplaneType;
    hotelType : HotelType;

    constructor(name: string, airplaneType: AirplaneType, hotelType: HotelType) {
        this.name = name;
        this.airplaneType = airplaneType;
        this.hotelType = hotelType;
    }
}
enum ServiceType {
  Airplane,
  Hotel,
  Transfer,
  Tour,
  TourLeader,
  Other
}

export class Program {
  name : string;
  public days : Array<Day>;
  programTypes : Array<ProgramType>;

  constructor(name) {
    this.name = name;
    this.days = [];    
    this.defineProgramTypes();
  }

  defineProgramTypes(){
    this.programTypes = [
      new ProgramType('Individual', 'adult', 'single'),
      new ProgramType('Couple', 'adult', 'double'),
      new ProgramType('Family', 'adult', 'triple'),
    ];
  }
  getInfo() {
    return `${this.name} - ${this.days.length} days`;
  }

  addDay(){
    this.days.push(new Day())
  }
}


export class Day {

  services: Array<Service>;

  constructor() {
    
    this.services = [];
  }

  addActivity(activity) {
    this.services.push(activity);
  }
}

export class Service {
  name: string;
  type: ServiceType;

  subseasons: Array<Season>;
  constructor(name, type: ServiceType) {
    this.name = name;
    this.type = type;
  }
  getPrice(date:Date, programType: ProgramType) {
    for (let season of this.subseasons) {
      if (date >= season.startDate && date <= season.endDate) {
        return season.getPrice(programType);
      }
    }
    throw new Error(`No season found for ${this.name} on ${date}`);
  }

  getPriceInterval(startDate:Date, endDate:Date, programType: ProgramType) {
    let totalPrice = 0;
    let currentDate : Date = startDate;
    while (currentDate <= endDate) {
        totalPrice += this.getPrice(currentDate, programType);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return totalPrice;
  }
}

export abstract class Season {
  startDate: Date;
  endDate: Date;
  abstract getPrice(programType : ProgramType);
  constructor(startDate: Date, endDate: Date){
    this.startDate = startDate;
    this.endDate = endDate;
  }
}

export class AirplaneSeason extends Season {
    
    adultPrice: number;
    childPrice: number;
    infantPrice: number;
    tourLeaderPrice: number;
    taxPrice: number;

    constructor(startDate: Date, endDate: Date, adultPrice: number, childPrice: number, infantPrice: number, tourLeaderPrice: number, taxPrice: number) {
        super(startDate, endDate);
        this.adultPrice = adultPrice;
        this.childPrice = childPrice;
        this.infantPrice = infantPrice;
        this.tourLeaderPrice = tourLeaderPrice;
        this.taxPrice = taxPrice;
    }

    getPrice(type: ProgramType) {
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
    
    singlePrice: number;
    doublePrice: number;
    triplePrice: number;
    childPrice: number;
    infantPrice: number;
    extraPrice: number;

    constructor(startDate: Date, endDate: Date, singlePrice: number, doublePrice: number, triplePrice: number, childPrice: number, infantPrice: number, extraPrice: number) {
        super(startDate, endDate);
        this.singlePrice = singlePrice;
        this.doublePrice = doublePrice;
        this.triplePrice = triplePrice;
        this.childPrice = childPrice;
        this.infantPrice = infantPrice;
        this.extraPrice = extraPrice;
    }

    getPrice(type: ProgramType) {
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





