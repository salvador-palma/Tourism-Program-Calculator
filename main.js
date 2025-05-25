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
});

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