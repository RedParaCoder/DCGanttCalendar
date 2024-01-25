import {IInputs, IOutputs} from "./generated/ManifestTypes";
import 'jquery';
import 'popper.js';
import 'bootstrap';
import '../node_modules/bootstrap-icons/font/bootstrap-icons.css';


//custom implementations

interface assignmentType {id: number, subject: string, title: string, start: Date, end: Date, description: string, canEdit: boolean};


export class DCGanttCalendar implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    /**
     * Empty constructor.
     */
    //Main html elements
    //the main element to be used as body for component.
    private main: HTMLDivElement;
    
    private properties: HTMLDivElement;
    private subjectDisplay: HTMLDivElement; //subjects ui
    private dateDisplay: HTMLDivElement; //dates ui
    private assignmentContainer: HTMLDivElement; //assignments ui 
    private scope: HTMLDivElement; //scope ui

    //recurring main sub elements
    private subjBdy: HTMLTableSectionElement;
    private dateTr: HTMLTableRowElement;
    private scopeBdy: HTMLTableSectionElement;

    //End of main elements


    //custom variables for use throughout

    

    
    constructor()
    {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement): void
    {
        
        var s_dateS = new Date("2023/6/6");
        var s_dateE = new Date("2024/1/1");
        var s_subj = [["Welding", 1], ["Lathing", 2], ["Drilling", 3]];
        var s_asgn: assignmentType[] = [
            {id: 1, subject: "Welding", title: "Stick weld", start: new Date("29.08.2023"), end: new Date("05.09.2023"), description: "Usage of Stick weld to combine two plates into one.", canEdit: true},
            {id: 2, subject: "Welding", title: "Tig Weld", start: new Date("25.08.2023"), end: new Date("28.09.2023"), description: "Usage of Tig weld to combine two plates into one.", canEdit: false},
            {id: 3, subject: "Lathing", title: "Cone", start: new Date("29.08.2023"), end: new Date("07.09.2023"), description: "Usage of Lathe to create a cone on a work piece.", canEdit: false},
            {id: 4, subject: "Drilling", title: "Centering", start: new Date("29.08.2023"), end: new Date("05.09.2023"), description: "Usage of Stick weld to combine two plates into one.", canEdit: false},
            {id: 5, subject: "Drilling", title: "Punching", start: new Date("29.08.2023"), end: new Date("05.09.2023"), description: "How to properly preform punches.", canEdit: false},
            {id: 6, subject: "Lathing", title: "Zeroing", start: new Date("29.08.2023"), end: new Date("05.09.2023"), description: "How to configure nulling on a lathe.", canEdit: false},
            {id: 7, subject: "Welding", title: "Cutting", start: new Date("29.08.2023"), end: new Date("05.09.2023"), description: "Different ways of cutting into steel e.g. Plastma, Torch, Saw.", canEdit: false},];
        //lets the resize of the component inside power apps update the container value on resize
        context.mode.trackContainerResize(true);
        //creation and assigning to main element variables.
        this.main = container; this.main.classList.add("mainBody");
        this.properties = this.main.appendChild(document.createElement("div")); this.properties.classList.add("properties");
        this.subjectDisplay = this.main.appendChild(document.createElement("div")); this.subjectDisplay.classList.add("subjectDisplay");
        this.dateDisplay = this.main.appendChild(document.createElement("div")); this.dateDisplay.classList.add("dateDisplay");
        this.assignmentContainer = this.main.appendChild(document.createElement("div")); this.assignmentContainer.classList.add("assignmentContainer");
        this.scope = this.main.appendChild(document.createElement("div")); this.scope.classList.add("scope");
        //creation of main elements structure
        //dates
        var dateTbl = this.dateDisplay.appendChild(document.createElement("table"));
        dateTbl.classList.add("table", "table-dark", "dateTbl"); dateTbl.id = "dateTbl";
        var dateHed = dateTbl.appendChild(document.createElement("thead"));
        this.dateTr = dateHed.insertRow();
        this.dateTr.setAttribute("scope", "row");

        //subjects
        var subjTbl = this.subjectDisplay.appendChild(document.createElement("table"));
        subjTbl.classList.add("table", "table-dark", "subjectTable");
        this.subjBdy = subjTbl.createTBody();

        //properties
        var drdBtn = this.properties.appendChild(document.createElement("button"));
        drdBtn.classList.add("btn", "btn-secondary", "dropdown-toggle");
        drdBtn.setAttribute("type", "button");
        drdBtn.setAttribute("data-bs-toggle", "dropdown");
        drdBtn.setAttribute("aria-expanded", "false");
        var drdBtnText = drdBtn.appendChild(document.createElement("i"));
        drdBtnText.classList.add("bi", "bi-gear");
        drdBtnText.textContent = "Properties";
        drdBtn.style.width = "100%";

        var drdUl = this.properties.appendChild(document.createElement("ul"));
        drdUl.classList.add("dropdown-menu", "dropdown-menu-dark");
        var addProperty = function(parent:HTMLElement, elm:string, classes?:string[]): HTMLElement{
            var elmName: string = elm;
            var propLi = parent.appendChild(document.createElement("li"));
            var retElm: HTMLElement = HTMLElement.prototype;
            if(elm == "bs-dv"){
                retElm = propLi.appendChild(document.createElement("hr"));
                retElm.classList.add("dropdown-divider");
                retElm = retElm;
            }else{
            retElm = propLi.appendChild(document.createElement(elm));
            retElm.classList.add("dropdown-item");
            }
            classes?.forEach(className => {
                retElm.classList.add(className);
            });
            return retElm;
        }
        var dayPropCount = addProperty(drdUl, "form");
        var dpDiv = dayPropCount.appendChild(document.createElement("div"));
        dpDiv.classList.add("form-group");
        var dpLable = dpDiv.appendChild(document.createElement("label"))
        dpLable.setAttribute("for", "dayIncrementer");
        dpLable.textContent = "Days";
        var dayInc = dpDiv.appendChild(document.createElement("input"));
        dayInc.classList.add("form-control", "dayInc");
        dayInc.id = "dayIncrementer";
        dayInc.setAttribute("type", "number");
        dayInc.step = "1";
        dayInc.min = "3";
        dayInc.value="7";
        addProperty(drdUl, "bs-dv");

        //assignments
        var asgnTbl = this.assignmentContainer.appendChild(document.createElement("table"));
        asgnTbl.id = "assignmentTable";
        asgnTbl.classList.add("table", "table-dark", "subjTable");

        //scope
        var scopeL = this.scope.appendChild(document.createElement("div")); scopeL.classList.add("navLeft");
        var scopeNLEnd = scopeL.appendChild(document.createElement("button"));
        scopeNLEnd.classList.add("btn", "btn-secondary");
        scopeNLEnd.innerHTML = "<i class='bi bi-chevron-bar-left'></i>";
        scopeNLEnd.setAttribute("title", "Start");
        var scopeNLJump = scopeL.appendChild(document.createElement("button"));
        scopeNLJump.classList.add("btn", "btn-secondary");
        scopeNLJump.innerHTML = "<i class='bi bi-chevron-double-left'></i>";
        scopeNLJump.setAttribute("title", "Jump");
        var scopeNLStep = scopeL.appendChild(document.createElement("button"));
        scopeNLStep.classList.add("btn", "btn-secondary");
        scopeNLStep.innerHTML = "<i class='bi bi-chevron-left'></i>";
        scopeNLStep.setAttribute("title", "Step");


        var scopeM = this.scope.appendChild(document.createElement("div")); scopeM.classList.add("scopeMain");
        var scopeTbl = scopeM.appendChild(document.createElement("table"));
        this.scopeBdy = scopeTbl.createTBody();


        var scopeR = this.scope.appendChild(document.createElement("div")); scopeR.classList.add("navRight");
        var scopeNRStep = scopeR.appendChild(document.createElement("button"));
        scopeNRStep.classList.add("btn", "btn-secondary");
        scopeNRStep.innerHTML = "<i class='bi bi-chevron-right'></i>";
        scopeNRStep.setAttribute("title", "Step");
        var scopeNRJump = scopeR.appendChild(document.createElement("button"));
        scopeNRJump.classList.add("btn", "btn-secondary");
        scopeNRJump.innerHTML = "<i class='bi bi-chevron-double-right'></i>";
        scopeNRJump.setAttribute("title", "Jump");
        var scopeNREnd = scopeR.appendChild(document.createElement("button"));
        scopeNREnd.classList.add("btn", "btn-secondary");
        scopeNREnd.innerHTML = "<i class='bi bi-chevron-bar-right'></i>";
        scopeNREnd.setAttribute("title", "End");
        
        //main structure end

        //generate sample data(this is also the way to generate after updateView is called?)
        //generate dates
        this.dc_generate.dates(s_dateS, s_dateE);


    }
    private dc_generate = {
        dates: (start: Date, end: Date) =>{
            if(start > end){console.log("dc_generate dates[error]: start is grater or equal to end!"); return false;}
            var dateControll = new Date(start);
            for(let i = 0; dateControll < end; i++){
                var itsDay: Date = new Date(start);
                itsDay.setDate(start.getDate()+i);
                dateControll = itsDay;
                var dateCell = this.dateTr.insertCell();
                dateCell.setAttribute("title", itsDay.toDateString());
            }
        },
    }


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {
        // Add code to update control view
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs
    {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void
    {
        // Add code to cleanup control if necessary
    }
}
