export class ProgramType {
    constructor(name, airplaneType, hotelType, transferType, tourType) {
        this.name = name;
        this.airplaneType = airplaneType;
        this.hotelType = hotelType;
    }
}

export class Program {
   
    constructor(name, days = []) {
        this.name = name;
        this.days = days;
        this.defineProgramTypes();
    }

    static fromJSON(obj) {
        return new Program(obj.name, obj.days.map(Day.fromJSON));
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

        for (var i = 0; i < this.days.length - 1; i++) {
            if (i < index) {
                result[i] = this.days[i];

            } else {
                result[i] = this.days[i + 1];
            }
        }

        this.days = result;
    }

    addService(day, name, type) {
        if (day < 0 || day >= this.days.length)
            throw new Error(`Day isn't included in the Schedule: ${day} in ${this.days.length}`);

        this.days[day].services.push(new Service(name, type));
    }

    removeService(day, index) {

        if (day < 0 || day >= this.days.length)
            throw new Error(`Day isn't included in the Schedule: ${day} in ${this.days.length}`);

        if (index < 0 || this.days[day].services.length <= index)
            throw new Error(`Service isn't included in that Day: ${index} in ${this.days[day].services.length}`);

        this.days[day].removeService(index);
    }

    addSeason(service, day) {
        if (day < 0 || day >= this.days.length)
            throw new Error(`Day isn't included in the Schedule: ${day} in ${this.days.length}`);
        if (service < 0 || this.days[day].services.length <= service)
            throw new Error(`Service isn't included in that Day: ${service} in ${this.days[day].services.length}`);

        this.days[day].services[service].addSeason();

    }

    getService(service, day) {
        if (day < 0 || day >= this.days.length)
            throw new Error(`Day isn't included in the Schedule: ${day} in ${this.days.length}`);
        if (service < 0 || this.days[day].services.length <= service)
            throw new Error(`Service isn't included in that Day: ${service} in ${this.days[day].services.length}`);
        return this.days[day].services[service];
    }
}


export class Day {
    constructor(services = []) {
        this.services = services;
    }

    static fromJSON(obj) {
        return new Day(obj.services.map(Service.fromJSON))
    }

    addActivity(activity) {
        this.services.push(activity);
    }

    removeService(index) {
        let result = [];

        for (var i = 0; i < this.services.length - 1; i++) {
            if (i < index) {
                result[i] = this.services[i];
            } else {
                result[i] = this.services[i + 1];
            }
        }
        this.services = result;
    }
}

export class Service {
    constructor(name, type, subseasons = []) {
        this.name = name;
        this.type = type;
        this.subseasons = subseasons;
    }

    static fromJSON(obj) {

        var map;
        switch (obj.type) {
            case "Airplane":
                map = obj.subseasons.map(AirplaneSeason.fromJSON);
                break;
            case "Hotel":
                map = obj.subseasons.map(HotelSeason.fromJSON);
                break;
            case "Transfer":
                map = obj.subseasons.map(TransferSeason.fromJSON);
                break;
            case "Tour":
                map = obj.subseasons.map(TourSeason.fromJSON);
                break;
            case "TourLeader":
            case "Other":
                break;
            default:
                throw new Error(`Invalid Service Type ${obj.type}`);
        }


        return new Service(obj.name, obj.type, map);
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

    addSeason() {
        var startDate = new Date();
        var endDate = new Date();
        if (this.subseasons.length == 0) {
            startDate.setDate(new Date().getDate());
            endDate.setDate(new Date().getDate() + 1);


        } else {
            const lastSeason = this.subseasons[this.subseasons.length - 1].endDate;
            startDate = new Date(lastSeason);
            startDate.setDate(startDate.getDate() + 1);

            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
        }
        var newSeason;
        switch (this.type) {
            case "Airplane":
                newSeason = new AirplaneSeason(startDate, endDate);
                break;
            case "Hotel":
                newSeason = new HotelSeason(startDate, endDate);
                break;
            case "Transfer":
                newSeason = new TransferSeason(startDate, endDate);
                break;
            case "Tour":
                newSeason = new TourSeason(startDate, endDate);
                break;
            case "Tour Leader":
            case "Other":

                break;
            default:
                throw new Error(`Invalid Service Type ${this.type}`);
        }

        this.subseasons.push(newSeason);

    }

    removeSeason(index) {
        let result = [];

        for (var i = 0; i < this.subseasons.length - 1; i++) {
            if (i < index) {
                result[i] = this.subseasons[i];
            } else {
                result[i] = this.subseasons[i + 1];
            }
        }
        this.subseasons = result;
    }
}

export class Season {
    constructor(startDate, endDate) {
        this.startDate = startDate;
        this.endDate = endDate;
    }

    getInnerHTML() { }
    getPrice(){}
    getOptions(){}
    static fromJSON(obj) {
        
    }
}

export class AirplaneSeason extends Season {
    constructor(startDate, endDate, adultPrice = 0, childPrice = 0, infantPrice = 0, tourLeaderPrice = 0, taxPrice = 0) {
        super(startDate, endDate);
        this.adultPrice = adultPrice;
        this.childPrice = childPrice;
        this.infantPrice = infantPrice;
        this.tourLeaderPrice = tourLeaderPrice;
        this.taxPrice = taxPrice;
    }

    static fromJSON(obj) {
        return new AirplaneSeason(new Date(obj.startDate), new Date(obj.endDate), 
            obj.adultPrice, obj.childPrice, obj.infantPrice, 
            obj.tourLeaderPrice, obj.taxPrice);
    }

    getPrice(type) {
        switch (type.airplaneType) {
            case 'adult': return this.adultPrice;
            case 'child': return this.childPrice;
            case 'infant': return this.infantPrice;
            case 'tourLeader': return this.tourLeaderPrice;
            case 'adult+tax': return this.adultPrice * this.taxPrice/100;
            case 'child+tax': return this.childPrice * this.taxPrice/100;
            case 'infant+tax': return this.infantPrice * this.taxPrice/100;
            case 'tourLeader+tax': return this.tourLeaderPrice * this.taxPrice/100;
            default:
                throw new Error(`Invalid Airplane Type ${type}`);
        }
    }

    getOptions(){
        return ['adult', 'child', 'infant', 'tourLeader', 'adult+tax', 'child+tax', 'infant+tax', 'tourLeader+tax']
    }

    saveSeason(seasonDetails, index, serviceCast) {
        const startDateInput = seasonDetails.querySelector('input[name="StartDate"]');
        const endDateInput = seasonDetails.querySelector('input[name="EndDate"]');
        const adultPriceInput = seasonDetails.querySelector('input[name="Adult"]');
        const childPriceInput = seasonDetails.querySelector('input[name="Child"]');
        const infantPriceInput = seasonDetails.querySelector('input[name="Infant"]');
        const tourLeaderPriceInput = seasonDetails.querySelector('input[name="Tour Leader"]');
        const taxPriceInput = seasonDetails.querySelector('input[name="Tax"]');



        var startDate = new Date(startDateInput.value);
        var endDate = new Date(endDateInput.value);
        var adultPrice = parseFloat(adultPriceInput.value);
        var childPrice = parseFloat(childPriceInput.value);
        var infantPrice = parseFloat(infantPriceInput.value);
        var tourLeaderPrice = parseFloat(tourLeaderPriceInput.value);
        var taxPrice = parseFloat(taxPriceInput.value);

        if (taxPrice < 0 || adultPrice < 0 || childPrice < 0 || infantPrice < 0 || tourLeaderPrice < 0) {
            return "Error: Prices cannot be negative.";
        }
        if (isNaN(adultPrice) || isNaN(childPrice) || isNaN(infantPrice) || isNaN(tourLeaderPrice) || isNaN(taxPrice)) {
            return "Error: Prices must be valid numbers.";
        }

        const result = validateDateRange(startDate, endDate, serviceCast, index);
        if( result !== "success") {
            return result;
        }

        this.startDate = startDate;
        this.endDate = endDate;
        this.adultPrice = adultPrice;
        this.childPrice = childPrice;
        this.infantPrice = infantPrice;
        this.tourLeaderPrice = tourLeaderPrice;
        this.taxPrice = taxPrice;

        return "success";
    }

    getInnerHTML() { 
        const AirplaneForm = `<div class="subseason vertical-display">
                    <div class="subseason-info horizontal-display">
                        <span>${DateToString(this.startDate)} - ${DateToString(this.endDate)}</span>
                    </div>
                    <div class="subseason-details vertical-display">
                        <div class="subseason-date-range horizontal-display">
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">From</label>
                            <input type="date" class="inputfieldGrey" name="StartDate" value="${formatDate(this.startDate)}"/>
                            </div>
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">To</label>
                            <input type="date"  class="inputfieldGrey" name="EndDate" value="${formatDate(this.endDate)}"/>
                            </div>
                        </div>
                        <div class="subseason-detail-config horizontal-display">
                            <div class="vertical-display textinput">
                            <label for="Adult">Adult</label>
                            <input type="number"  name="Adult" class="inputfieldGrey" value="${this.adultPrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Child">Child</label>
                                <input type="number" name="Child" class="inputfieldGrey" value="${this.childPrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Infant">Infant</label>
                                <input type="number" name="Infant" class="inputfieldGrey" value="${this.infantPrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                            <label for="Tour Leader">Tour Leader</label>
                            <input type="number"  name="Tour Leader" class="inputfieldGrey" value="${this.tourLeaderPrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                            <label for="Tax">Tax</label>
                            <input type="number"  name="Tax" class="inputfieldGrey" value="${this.taxPrice}"/>
                            </div>
                            
                        </div>
                        <div class="subseason-detail-console"><span></span></div>
                        <div class="subseason-detail-options horizontal-display">
                            <button class="subseason-delete">Delete</button>
                            <button class="subseason-save">Save</button>
                        </div>
                       
                    </div>

                </div>`
        return AirplaneForm;
    }


}

export class HotelSeason extends Season {
    constructor(startDate, endDate, singlePrice = 0, doublePrice = 0, triplePrice = 0, childPrice = 0, infantPrice = 0, extraPrice = 0) {
        super(startDate, endDate);
        this.singlePrice = singlePrice;
        this.doublePrice = doublePrice;
        this.triplePrice = triplePrice;
        this.childPrice = childPrice;
        this.infantPrice = infantPrice;
        this.extraPrice = extraPrice;
    }

    static fromJSON(obj) {
        return new HotelSeason(new Date(obj.startDate), new Date(obj.endDate),
            obj.singlePrice, obj.doublePrice, obj.triplePrice,
            obj.childPrice, obj.infantPrice, obj.extraPrice);
    }

    getPrice(type, people) {
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

    saveSeason(seasonDetails, index, serviceCast) {
        const startDateInput = seasonDetails.querySelector('input[name="StartDate"]');
        const endDateInput = seasonDetails.querySelector('input[name="EndDate"]');
        const singlePriceInput = seasonDetails.querySelector('input[name="Single"]');
        const doublePriceInput = seasonDetails.querySelector('input[name="Double"]');
        const triplePriceInput = seasonDetails.querySelector('input[name="Triple"]');
        const childPriceInput = seasonDetails.querySelector('input[name="Child"]');
        const infantPriceInput = seasonDetails.querySelector('input[name="Infant"]');
        const extraPriceInput = seasonDetails.querySelector('input[name="Extra"]');


        var startDate = new Date(startDateInput.value);
        var endDate = new Date(endDateInput.value);
        var singlePrice = parseFloat(singlePriceInput.value);
        var doublePrice = parseFloat(doublePriceInput.value);
        var triplePrice = parseFloat(triplePriceInput.value);
        var childPrice = parseFloat(childPriceInput.value);
        var infantPrice = parseFloat(infantPriceInput.value);
        var extraPrice = parseFloat(extraPriceInput.value);

        if (singlePrice < 0 || doublePrice < 0 || triplePrice < 0 || childPrice < 0 || infantPrice < 0 || extraPrice < 0) {
            return "Error: Prices cannot be negative.";
        }

        if (isNaN(singlePrice) || isNaN(doublePrice) || isNaN(triplePrice) || isNaN(childPrice) || isNaN(infantPrice) || isNaN(extraPrice)) {
            return "Error: Prices must be valid numbers.";
        }

        const result  = validateDateRange(startDate, endDate, serviceCast, index);
        if( result !== "success") {
            return result;
        }


        this.startDate = startDate;
        this.endDate = endDate;
        this.singlePrice = singlePrice;
        this.doublePrice = doublePrice;
        this.triplePrice = triplePrice;
        this.childPrice = childPrice;
        this.infantPrice = infantPrice;
        this.extraPrice = extraPrice;

        return "success";
    }
    getInnerHTML() {
        const HotelForm = `<div class="subseason vertical-display">
                    <div class="subseason-info horizontal-display">
                        <span>${DateToString(this.startDate)} - ${DateToString(this.endDate)}</span>
                    </div>
                    <div class="subseason-details vertical-display">
                        <div class="subseason-date-range horizontal-display">
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">From</label>
                            <input type="date" class="inputfieldGrey" name="StartDate" value="${formatDate(this.startDate)}"/>
                            </div>
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">To</label>
                            <input type="date"  class="inputfieldGrey" name="EndDate" value="${formatDate(this.endDate)}"/>
                            </div>
                        </div>
                        <div class="subseason-detail-config horizontal-display">
                            <div class="vertical-display textinput">
                            <label for="Single">Single</label>
                            <input type="number"  name="Single" class="inputfieldGrey" value="${this.singlePrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Double">Double</label>
                                <input type="number" name="Double" class="inputfieldGrey" value="${this.doublePrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Triple">Triple</label>
                                <input type="number" name="Triple" class="inputfieldGrey" value="${this.triplePrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                            <label for="Child">Child</label>
                            <input type="number"  name="Child" class="inputfieldGrey" value="${this.childPrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                            <label for="Infant">Infant</label>
                            <input type="number"  name="Infant" class="inputfieldGrey" value="${this.infantPrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                            <label for="Extra">Extra</label>
                            <input type="number"  name="Extra" class="inputfieldGrey" value="${this.extraPrice}"/>
                            </div>
                            
                        </div>
                        <div class="subseason-detail-console"><span></span></div>
                        <div class="subseason-detail-options horizontal-display">
                            <button class="subseason-delete">Delete</button>
                            <button class="subseason-save">Save</button>
                        </div>
                       
                    </div>

                </div>`
        return HotelForm;
    }
}

export class TransferSeason extends Season {
    constructor(startDate, endDate, busPrice = 0, guidePrice = 0, otherPrice = 0) {
        super(startDate, endDate);
        this.busPrice = busPrice;
        this.guidePrice = guidePrice;
        this.otherPrice = otherPrice;
    }

    static fromJSON(obj) {
        return new TransferSeason(new Date(obj.startDate), new Date(obj.endDate), 
            obj.busPrice, obj.guidePrice, obj.otherPrice);
    }

    getPrice(type, people) {
        if(people <= 0){
            throw new Error(`Invalid number of Clients: ${people}`);
        }
        switch (type.airplaneType) {
            case 'bus': return this.busPrice / people;
            case 'guide': return this.guidePrice / people;
            case 'other': return this.otherPrice;
            default:
                throw new Error(`Invalid Airplane Type ${type}`);
        }
    }

    saveSeason(seasonDetails, index, serviceCast) {
        const startDateInput = seasonDetails.querySelector('input[name="StartDate"]');
        const endDateInput = seasonDetails.querySelector('input[name="EndDate"]');
        const price1Input = seasonDetails.querySelector('input[name="Bus"]');
        const price2Input = seasonDetails.querySelector('input[name="Guide"]');
        const price3Input = seasonDetails.querySelector('input[name="Other"]');



        var startDate = new Date(startDateInput.value);
        var endDate = new Date(endDateInput.value);
        var price1 = parseFloat(price1Input.value);
        var price2 = parseFloat(price2Input.value);
        var price3 = parseFloat(price3Input.value);

        if (price1 < 0 || price2 < 0 || price3 < 0) {
            return "Error: Prices cannot be negative.";
        }
        if (isNaN(price1) || isNaN(price2) || isNaN(price3)) {
            return "Error: Prices must be valid numbers.";
        }

        const result = validateDateRange(startDate, endDate, serviceCast, index);
        if( result !== "success") {
            return result;
        }

        this.startDate = startDate;
        this.endDate = endDate;
        this.busPrice = price1;
        this.guidePrice = price2;
        this.otherPrice = price3;

        return "success";
    }

    getInnerHTML() { 
        const AirplaneForm = `<div class="subseason vertical-display">
                    <div class="subseason-info horizontal-display">
                        <span>${DateToString(this.startDate)} - ${DateToString(this.endDate)}</span>
                    </div>
                    <div class="subseason-details vertical-display">
                        <div class="subseason-date-range horizontal-display">
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">From</label>
                            <input type="date" class="inputfieldGrey" name="StartDate" value="${formatDate(this.startDate)}"/>
                            </div>
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">To</label>
                            <input type="date"  class="inputfieldGrey" name="EndDate" value="${formatDate(this.endDate)}"/>
                            </div>
                        </div>
                        <div class="subseason-detail-config horizontal-display">
                            <div class="vertical-display textinput">
                            <label for="Bus">Bus</label>
                            <input type="number"  name="Bus" class="inputfieldGrey" value="${this.busPrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Guide">Guide</label>
                                <input type="number" name="Guide" class="inputfieldGrey" value="${this.guidePrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Other">Other</label>
                                <input type="number" name="Other" class="inputfieldGrey" value="${this.otherPrice}"/>
                            </div>                            
                        </div>
                        <div class="subseason-detail-console"><span></span></div>
                        <div class="subseason-detail-options horizontal-display">
                            <button class="subseason-delete">Delete</button>
                            <button class="subseason-save">Save</button>
                        </div>
                       
                    </div>

                </div>`
        return AirplaneForm;
    }
}

export class TourSeason extends Season {
    constructor(startDate, endDate, busPrice = 0, guidePrice = 0, extraPrice = 0, lunchPrice = 0, entriesPrice = 0, boatPrice = 0) {
        super(startDate, endDate);
        this.busPrice = busPrice;
        this.guidePrice = guidePrice;
        this.extraPrice = extraPrice;
        this.lunchPrice = lunchPrice;
        this.entriesPrice = entriesPrice;
        this.boatPrice = boatPrice;
    }

    static fromJSON(obj) {
        return new TourSeason(new Date(obj.startDate), new Date(obj.endDate), 
            obj.busPrice, obj.guidePrice, obj.extraPrice, obj.lunchPrice, obj.entriesPrice, obj.boatPrice);
    }

    getPrice(type, people) {
        switch (type.airplaneType) {
            case 'adult': return this.busPrice/people + this.guidePrice/people + this.extraPrice + this.lunchPrice + this.entriesPrice + this.boatPrice;
            case 'child': return this.busPrice/people + this.guidePrice/people + this.extraPrice + this.lunchPrice + this.entriesPrice + this.boatPrice;

            default:
                throw new Error(`Invalid Airplane Type ${type}`);
        }
    }

    saveSeason(seasonDetails, index, serviceCast) {
        const startDateInput = seasonDetails.querySelector('input[name="StartDate"]');
        const endDateInput = seasonDetails.querySelector('input[name="EndDate"]');
        const price1Input = seasonDetails.querySelector('input[name="Bus"]');
        const price2Input = seasonDetails.querySelector('input[name="Guide"]');
        const price3Input = seasonDetails.querySelector('input[name="Extra"]');
        const price4Input = seasonDetails.querySelector('input[name="Lunch"]');
        const price5Input = seasonDetails.querySelector('input[name="Entries"]');
        const price6Input = seasonDetails.querySelector('input[name="Boat"]');

        var startDate = new Date(startDateInput.value);
        var endDate = new Date(endDateInput.value);
        var price1 = parseFloat(price1Input.value);
        var price2 = parseFloat(price2Input.value);
        var price3 = parseFloat(price3Input.value);
        var price4 = parseFloat(price4Input.value);
        var price5 = parseFloat(price5Input.value);
        var price6 = parseFloat(price6Input.value);

        if (price1 < 0 || price2 < 0 || price3 < 0 || price4 < 0 || price5 < 0 || price6 < 0) {
            return "Error: Prices cannot be negative.";
        }
        if (isNaN(price1) || isNaN(price2) || isNaN(price3) || isNaN(price4) || isNaN(price5) || isNaN(price6)) {
            return "Error: Prices must be valid numbers.";
        }

        const result = validateDateRange(startDate, endDate, serviceCast, index);
        if( result !== "success") {
            return result;
        }

        this.startDate = startDate;
        this.endDate = endDate;
        this.busPrice = price1;
        this.guidePrice = price2;
        this.extraPrice = price3;
        this.lunchPrice = price4;
        this.entriesPrice = price5;
        this.boatPrice = price6;

        return "success";
    }

    getInnerHTML() { 
        const AirplaneForm = `<div class="subseason vertical-display">
                    <div class="subseason-info horizontal-display">
                        <span>${DateToString(this.startDate)} - ${DateToString(this.endDate)}</span>
                    </div>
                    <div class="subseason-details vertical-display">
                        <div class="subseason-date-range horizontal-display">
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">From</label>
                            <input type="date" class="inputfieldGrey" name="StartDate" value="${formatDate(this.startDate)}"/>
                            </div>
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">To</label>
                            <input type="date"  class="inputfieldGrey" name="EndDate" value="${formatDate(this.endDate)}"/>
                            </div>
                        </div>
                        <div class="subseason-detail-config horizontal-display">
                            <div class="vertical-display textinput">
                            <label for="Bus">Bus</label>
                            <input type="number"  name="Bus" class="inputfieldGrey" value="${this.busPrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Guide">Guide</label>
                                <input type="number" name="Guide" class="inputfieldGrey" value="${this.guidePrice}"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Extra">Extra</label>
                                <input type="number" name="Extra" class="inputfieldGrey" value="${this.extraPrice}"/>
                            </div>   
                            <div class="vertical-display textinput">
                                <label for="Lunch">Lunch</label>
                                <input type="number" name="Lunch" class="inputfieldGrey" value="${this.lunchPrice}"/>
                            </div> 
                            <div class="vertical-display textinput">
                                <label for="Entries">Entries</label>
                                <input type="number" name="Entries" class="inputfieldGrey" value="${this.entriesPrice}"/>
                            </div> 
                            <div class="vertical-display textinput">
                                <label for="Boat">Boat</label>
                                <input type="number" name="Boat" class="inputfieldGrey" value="${this.boatPrice}"/>
                            </div>                          
                        </div>
                        <div class="subseason-detail-console"><span></span></div>
                        <div class="subseason-detail-options horizontal-display">
                            <button class="subseason-delete">Delete</button>
                            <button class="subseason-save">Save</button>
                        </div>
                       
                    </div>

                </div>`
        return AirplaneForm;
    }
}


function validateDateRange(startDate, endDate, serviceCast, index) {
    if (startDate > endDate) {
        return "Error: Start date must be before end date.";
    }
    for (let i = 0; i < serviceCast.subseasons.length; i++) {
        if (i == index) continue;
        const subseason = serviceCast.subseasons[i];
        if (subseason.startDate <= startDate && startDate <= subseason.endDate) {
            return `Error: The season overlaps with season ${DateToString(subseason.startDate)} - ${DateToString(subseason.endDate)}.`;
        }
        if (subseason.startDate <= endDate && endDate <= subseason.endDate) {
            return `Error: The season overlaps with season ${DateToString(subseason.startDate)} - ${DateToString(subseason.endDate)}.`;
        }
        if (startDate <= subseason.startDate && subseason.endDate <= endDate) {
            return `Error: The season entails the season ${DateToString(subseason.startDate)} - ${DateToString(subseason.endDate)}.`;
        }
    }
    return "success";
}
function DateToString(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

}

const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};