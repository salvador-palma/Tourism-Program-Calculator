import { Program, ProgramType, Day, Service, AirplaneSeason, HotelSeason } from "./classes.js"

var program;

function DisplayProgram(program){
    console.log("Refreshing...");
    const dayContainer = document.getElementById("Program-Day-Container")
    
    var i = 1;
    var innerText = ""
    program.days.forEach(element => {

        var innerTextServices = "";
        var j = 0;
        element.services.forEach(service => {
            innerTextServices += `<div class="Program-Service-Container" class="vertical-display">
                                <div class="Service horizontal-display">
                                    <img src="/img/${service.type}.png" />
                                    <span>${service.name}</span>
                                    <button day="${i}" serv="${j}" class="static-button Day-Service-Delete">x</button>
                                </div>
                            </div>`;
            j++;
        });

        innerText += `<div class="Day-Container vertical-display">
                        <div class="Day-Description horizontal-display">
                            <span>DAY ${i}</span>
                            <button class="Program-Day-Delete static-button">x</button>
                        </div>
                        <div class="Day-Services vertical-display">
                            ${innerTextServices}
                            <button class="Program-Day-Service">+ Service</button>
                        </div>
                    </div>`
        i++;
    });

    dayContainer.innerHTML = innerText;

    const dayDeleteBtns = document.querySelectorAll('.Program-Day-Delete');
    dayDeleteBtns?.forEach((element, index) => element.addEventListener("click", () => RemoveDay(index)));

    const serviceDeleteBtns = document.querySelectorAll('.Day-Service-Delete');
    serviceDeleteBtns?.forEach(element => element.addEventListener("click", () => RemoveService(element.getAttribute('day') - 1, element.getAttribute('serv'))));
    
    const addServiceBtns = document.querySelectorAll('.Program-Day-Service');
    addServiceBtns?.forEach((element, index) => element.addEventListener("click", () => ShowCreateServiceForm(index)));
    
}


function AddDay(){
    program.addDay();
    DisplayProgram(program)
}

function RemoveDay(n){
    program.removeDay(n);
    DisplayProgram(program);
}


function AddService(day, name, type){
    if(name == ""){name = "Unnamed Service"}
    program.addService(day, name, type);
    DisplayProgram(program);
}

function RemoveService(day, id){
    program.removeService(day, id);
    DisplayProgram(program);
}

function ShowCreateServiceForm(day){
    HideObject(document.getElementById("PopUp"), false);
    HideObject(document.getElementById("CreateService"), false);


    var returnServiceBtn = document.getElementById("CancelServiceButton");
    returnServiceBtn = removeAllButtonEvents(returnServiceBtn);
    returnServiceBtn.addEventListener("click", ()=>{ 
        HideObject(document.getElementById("PopUp"), true);
        HideObject(document.getElementById("CreateService"), true);
    })
    var addServiceBtn = document.getElementById("AddServiceButton");
    addServiceBtn = removeAllButtonEvents(addServiceBtn);
    addServiceBtn.addEventListener("click", ()=>{ 
        const type = document.getElementById("AddServiceType").value;
        const name = document.getElementById("AddServiceName").value;
        AddService(day, name, type);
        HideObject(document.getElementById("PopUp"), true);
        HideObject(document.getElementById("CreateService"), true);
    })
}



function CreateNewProgram() {
    HideObject(document.getElementById("CreateOpenProgram-Container"), true);
    HideObject(document.getElementById("Program-Container"), false);
}
function HideObject(element, hide) {
    if (hide) {
        element.classList.add("hidden");
    }
    else {
        element.classList.remove("hidden");
    }
}
document.addEventListener("DOMContentLoaded", function () {
    program = new Program("");
    console.log("Document loaded, initializing event listeners...");

    var button = document.getElementById("CreateProgram");
    button?.addEventListener("click", CreateNewProgram);

    var addDayBtn = document.getElementById("Program-Day-Add");
    addDayBtn.addEventListener("click", AddDay);


    const seasonsBtns = document.querySelectorAll(".subseason-info");
    seasonsBtns.forEach(element=> element.addEventListener("click", () => {

    }))
});

function toggleSeasonDetails(){
    
}
function removeAllButtonEvents(button) {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    return newButton;
}

// <div id="Program-Day-Container" class="vertical-display">
//                     <div class="Day-Container vertical-display">
//                         <div class="Day-Description horizontal-display">
//                             <span>DAY 1</span>
//                             <button class="Program-Day-Delete static-button" onclick="RemoveDay(this)">x</button>
//                         </div>
//                         <div class="Day-Services vertical-display">
//                             <div class="Program-Service-Container" class="vertical-display">
//                                 <div class="Service horizontal-display">
//                                     <img src="/img/Airplane.png" />
//                                     <span>LIS - PAR Flight x1 Economy Seat</span>
//                                     <button class="static-button" onclick="RemoveService(this)">x</button>
//                                 </div>
//                             </div>
//                             <button class="Program-Day-Service" onclick="AddService(this)">+ Service</button>
//                         </div>
                        
//                     </div>



const AirplaneForm = `<div class="subseason vertical-display subseason-selected">
                    <div class="subseason-info horizontal-display">
                        <span>1 Jan - 5 Feb</span>
                    </div>
                    <div class="subseason-details vertical-display">
                        <div class="subseason-date-range horizontal-display">
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">From</label>
                            <input type="date" class="inputfieldGrey"/>
                            </div>
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">To</label>
                            <input type="date"  class="inputfieldGrey"/>
                            </div>
                        </div>
                        <div class="subseason-detail-config horizontal-display">
                            <div class="vertical-display textinput">
                            <label for="Adult">Adult</label>
                            <input type="number"  name="Adult" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Child">Child</label>
                                <input type="number" name="Child" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Infant">Infant</label>
                                <input type="number" name="Infant" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Tour Leader">Tour Leader</label>
                                <input type="number" name="Tour Leader" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Taxes">Taxes</label>
                                <input type="number" name="Taxes" class="inputfieldGrey"/>
                            </div>
                        </div>
                       
                    </div>

                </div>`
const TransferForm = `<div class="subseason vertical-display subseason-selected">
                    <div class="subseason-info horizontal-display">
                        <span>1 Jan - 5 Feb</span>
                    </div>
                    <div class="subseason-details vertical-display">
                        <div class="subseason-date-range horizontal-display">
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">From</label>
                            <input type="date" class="inputfieldGrey"/>
                            </div>
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">To</label>
                            <input type="date"  class="inputfieldGrey"/>
                            </div>
                        </div>
                        <div class="subseason-detail-config horizontal-display">
                            <div class="vertical-display textinput">
                            <label for="Bus">Bus</label>
                            <input type="number"  name="Bus" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Guide">Guide</label>
                                <input type="number" name="Guide" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Others">Others</label>
                                <input type="number" name="Others" class="inputfieldGrey"/>
                            </div>
                            
                        </div>
                       
                    </div>

                </div>`
const HotelForm = `<div class="subseason vertical-display subseason-selected">
                    <div class="subseason-info horizontal-display">
                        <span>1 Jan - 5 Feb</span>
                    </div>
                    <div class="subseason-details vertical-display">
                        <div class="subseason-date-range horizontal-display">
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">From</label>
                            <input type="date" class="inputfieldGrey"/>
                            </div>
                            <div class="horizontal-display textinput">
                            <label for="Program-Name">To</label>
                            <input type="date"  class="inputfieldGrey"/>
                            </div>
                        </div>
                        <div class="subseason-detail-config horizontal-display">
                            <div class="vertical-display textinput">
                            <label for="Single">Single</label>
                            <input type="number"  name="Single" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Double">Double</label>
                                <input type="number" name="Double" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Triple">Triple</label>
                                <input type="number" name="Triple" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Child">Child</label>
                                <input type="number" name="Child" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Infant">Infant</label>
                                <input type="number" name="Infant" class="inputfieldGrey"/>
                            </div>
                            <div class="vertical-display textinput">
                                <label for="Extras">Extras</label>
                                <input type="number" name="Extras" class="inputfieldGrey"/>
                            </div>
                        </div>
                       
                    </div>

                </div>`
const TourForm = ``
const TourLeaderForm = ``
const OtherForm = ``
