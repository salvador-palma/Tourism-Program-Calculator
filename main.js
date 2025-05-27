import { Program, ProgramType, Day, Service, AirplaneSeason, HotelSeason } from "./classes.js"

var program;

var selectedDay = null;
var selectedService = null;

function DisplayProgram(program){
    console.log("Refreshing...");
    const dayContainer = document.getElementById("Program-Day-Container")

    document.getElementById("Program-Name").value = program.name;
    
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
                                    <div class="horizontal-display">
                                    <button class="static-button Day-Service-Config"><img src="/img/Pencil.png"></button>
                                    <button day="${i}" serv="${j}" class="static-button Day-Service-Delete"><img src="/img/Bin.png"></button>
                                    </div>
                                </div>
                            </div>`;
            j++;
        });

        innerText += `<div class="Day-Container vertical-display">
                        <div class="Day-Description horizontal-display">
                            <span>DAY ${i}</span>
                            <button class="Program-Day-Delete static-button"><img src="/img/Bin.png"></button>
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

    const serviceBtns = document.querySelectorAll('.Day-Service-Config');
    serviceBtns?.forEach((element, index) => element.addEventListener("click", () => {
        HideObject(document.getElementById("ContractView"), false);
        HideObject(document.getElementById("PopUp"), false);
        window.scrollTo(0, 0);

        selectedDay = element.parentNode.children[1].getAttribute('day') - 1;
        selectedService = element.parentNode.children[1].getAttribute('serv');
        console.log("Selected Day: " + selectedDay + ", Selected Service: " + selectedService);
        DisplaySeasons(program, selectedDay, selectedService);
    }));
    
    const addServiceBtns = document.querySelectorAll('.Program-Day-Service');
    addServiceBtns?.forEach((element, index) => element.addEventListener("click", () => ShowCreateServiceForm(index)));


}

function DisplaySeasons(program, day, service){
    console.log("Refreshing Subseasons...");
    const seasonContainer = document.getElementById("Subseason-Container");

    const serviceCast = program.getService(service, day);
    const type = serviceCast.type;

    const title = document.getElementById("ContractView-Title").querySelector("h1");
    const subtitle = document.getElementById("ContractView-Title").querySelector("span");
    title.innerHTML = serviceCast.name;
    subtitle.innerHTML = `Type - ${type}`;

    var innerText = "";
    serviceCast.subseasons.forEach(season => {
        innerText += season.getInnerHTML();
    });
    seasonContainer.innerHTML = innerText;


    const seasonBtns = document.querySelectorAll('.subseason-info');
    seasonBtns?.forEach(element => element.addEventListener("click", () => ToggleSeasonDetails(element)));

    const seasonDeleteBtns = document.querySelectorAll('.subseason-delete');
    seasonDeleteBtns?.forEach((element, index) => element.addEventListener("click", () => RemoveSeason(index)));

    const seasonSaveBtns = document.querySelectorAll('.subseason-save');
    seasonSaveBtns?.forEach((element, index) => element.addEventListener("click", () => SaveSeason(element.parentNode.parentNode, index)));

}

function ToggleSeasonDetails(element) {
    if( element.parentNode.classList.contains("subseason-selected")){
        element.parentNode.classList.remove("subseason-selected");
    }else{
        const siblings = Array.from(element.parentNode.parentNode.children);
        siblings.forEach(child => {
            child.classList.remove("subseason-selected");
        });
        element.parentNode.classList.add("subseason-selected");
    }
    
}


function AddDay(){
    program.addDay();
    DisplayProgram(program)
}

function RemoveDay(n){
    console.log("Removing day " + n);
    program.removeDay(n);
    DisplayProgram(program);
}


function AddService(day, name, type){
    if(name == ""){name = `Unnamed ${type} Service`}
    program.addService(day, name, type);
    DisplayProgram(program);
}

function RemoveService(day, id){
    program.removeService(day, id);
    DisplayProgram(program);
}

function AddSeason(){
    program.addSeason(selectedService, selectedDay);
    DisplaySeasons(program, selectedDay, selectedService);
}

function CloseSeason(){
    HideObject(document.getElementById("ContractView"), true);
    HideObject(document.getElementById("PopUp"), true);
    window.scrollTo(0, 0);
}

function RemoveSeason(index){
    const serviceCast = program.getService(selectedService, selectedDay);
    serviceCast.removeSeason(index);
    DisplaySeasons(program, selectedDay, selectedService);
}
function SaveSeason(element, index){
    const serviceCast = program.getService(selectedService, selectedDay);


    const serviceCastSeason = serviceCast.subseasons[index];
    
    const result = serviceCastSeason.saveSeason(element, index, serviceCast);

    if(result == "success"){
        console.log("Season saved successfully.");
        DisplaySeasons(program, selectedDay, selectedService);
    }else{
        console.log("Error saving season: " + result);
        const consoleS = element.querySelector(".subseason-detail-console");
        consoleS.innerHTML = result;

    }


    

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

    var addSeasBtn = document.getElementById("AddSeasonButton");
    addSeasBtn.addEventListener("click", AddSeason);

    var closeDayBtn = document.getElementById("CloseSeasonButton");
    closeDayBtn.addEventListener("click", CloseSeason);

    var downloadBtn = document.getElementById("Download-Program");
    downloadBtn.addEventListener("click", Download);

    var loadBtn = document.getElementById("Load-Program");
    loadBtn.addEventListener("click", Load);

    var titleInputField = document.getElementById("Program-Name");
    titleInputField.addEventListener("change", ()=>{
        program.name = document.getElementById("Program-Name").value;
    })

    

    const seasonsBtns = document.querySelectorAll(".subseason-info");
    seasonsBtns.forEach(element=> element.addEventListener("click", () => {

    }))
});

function Download() {
    console.log("Downloading program...");
    const blob = new Blob([JSON.stringify(program, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${program.name}.json`;
    a.click();
}
function Load(){
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            const rawObj = JSON.parse(reader.result);
            program = Program.fromJSON(rawObj); // <- force into class
            console.log('Loaded Program instance:', program);
            DisplayProgram(program);
        };
        reader.readAsText(file);
    };
    input.click();
}

function removeAllButtonEvents(button) {
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    return newButton;
}


