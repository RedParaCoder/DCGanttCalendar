import 'jquery';
import 'popper.js';
import 'bootstrap';
import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { DOMElement, ElementType, createElement } from 'react';
import { Interface } from 'readline';
import { cssNumber } from 'jquery';

//custom functions that can be deleted if not used!

var getDaysArray = function(start:Date, end:Date) { //custom get days between two dates, returns array, but can also get count between days by adding (.length) after.
    for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
        arr.push(new Date(dt));
    }
    return arr;
};

var dayIndex:String[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var _string = { //custom string creater that can return an empty string, random string provided that needs a lenght for the string, and lorem ipsum with word count/length (0 for entire).
    empty: '',

    rand: function(len:number){
        let res = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for(let i = 0; i < len; i++){
            res += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return res;
    },

    lorem: function(len:number){
        let res = '';
        const ipsum = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";
        if(len == 0){
            return ipsum;
        }
        let ISLen = 68;
        let times = Math.floor(len/ISLen);
        var ipsumSplitted = [];
        for (let i = 0; i < times; i++){
            res += ipsum + ' ';
        }
        if(len/68 > times){
            ipsumSplitted = ipsum.split(" ", len-(times*ISLen));
            for(let i = 0; i < ipsumSplitted.length; i++){
                res += ipsumSplitted[i] + ' ';
            }
        }
        return res.trim();
    },
};

var dayWidthValue = {
    min: 6.0,
    check: function(width:Float64Array | number){
        var val;
        if (+width > +this.min){
            val = +width;
        }else{val = this.min;}
        return val;
    }

};



//function for creating table data data
function createTableRowData(remSize:Float64Array | number, ddates:Date[], header:boolean){
    var returnValue = document.createElement('tr');
        if(header == false){
            for(let i = 0; i < ddates.length; i++){
                var ddDay = returnValue.insertCell();
                ddDay.setAttribute("data-toggle", "tooltip");
                ddDay.setAttribute("data-placement", "top");
                ddDay.setAttribute("title", ddates[i].toDateString());
                ddDay.setAttribute("style", "height: " + remSize + "rem !important; border: solid thin black;");
            }
        }else{
            for(let i = 0; i < ddates.length; i++){
                let dd = (ddates[i].getDate()).toString();
                if (dd.length < 2) {dd = '0' + dd;}
                var dDay = returnValue.insertCell();
                dDay.textContent = dd + '. ' + dayIndex[ddates[i].getDay()];
                dDay.setAttribute("data-toggle", "tooltip");
                dDay.setAttribute("data-placement", "bottom");
                dDay.setAttribute("title", ddates[i].toDateString());
                dDay.setAttribute("style", "min-width: " + remSize + "rem; max-width: " + remSize + "rem; height: 1rem"); //set width of cell 
                dDay.outerHTML = "<th" + dDay.outerHTML.toString().slice(3, -3) + "th>"; //illegal move to change element type 💀
            }
        }
    return returnValue;
}

//function for creating table data for subjects
var createSubject = {
    rows: function(subjects: string[], bodyToUse: HTMLTableSectionElement){ //function to create table rows 
        var tblBody = bodyToUse;
        let trElm = tblBody.appendChild(document.createElement("tr"));
        var trScope = trElm.insertCell();
        trScope.setAttribute("style", "height: 1rem");
        trScope.setAttribute("id", "tableDates");
        trScope.textContent = "Dates";
        trScope.outerHTML = "<th" + trScope.outerHTML.slice(3, -3) + "th>";
        for(let subject in subjects){
            let trSubject = tblBody.appendChild(document.createElement("tr"));
            trSubject.setAttribute("id", subjects[subject]);
            trSubject.classList.add("position-relative");
            let thSubject = trSubject.insertCell();
            thSubject.setAttribute("scope", "row");
            thSubject.textContent = subjects[subject];
            //console.log(subject)
            thSubject.outerHTML = "<th" + thSubject.outerHTML.toString().slice(3, -3) + "th>";
        }
        return;
    },
    assignment: function(assignments: assignmentType[]): HTMLTableCellElement[] {
        let assignmentsArray: HTMLTableCellElement[] = [] as HTMLTableCellElement[];
        for(let i = 0; i < assignments.length; i++){
            let assignment = assignments[i];
            let subjectRow = document.getElementById(assignment.subject) as HTMLTableRowElement;
            let thisAssignment = subjectRow.insertCell();
            thisAssignment.textContent = assignment.title;
            thisAssignment.setAttribute("id", "assignment-" + assignment.id);
            thisAssignment.setAttribute("data.toggle", "tooltip");
            thisAssignment.setAttribute("data-placement", "bottom");
            thisAssignment.setAttribute("title", assignment.title);
            let thisText = thisAssignment.appendChild(document.createElement('p'));
            thisText.textContent = assignment.title;
            thisText.classList.add("assignmentP");
            assignmentsArray.push(thisAssignment);
        }
        return assignmentsArray;
    },
    positioning: function(assignments: assignmentType[], coElements: HTMLTableCellElement[], resetFirst: boolean){
        for(let i = 0; i < assignments.length; i++){
            var thisElement: HTMLTableCellElement = coElements[i];
            if(resetFirst == true){thisElement.setAttribute("style", "");}
            var thisAssignment: assignmentType = assignments[i];
            //coresponding table cells in calendar table body
            var corTR = document.getElementById("table-body-row");
            var corSTarget = corTR?.querySelector("[title='"+ thisAssignment.start.toDateString() +"']");
            var corETarget = corTR?.querySelector("[title='"+ thisAssignment.end.toDateString() +"']");
            //coresponding.. END
            //calculations for assignment element position and sizes
            var absoluteX = +thisElement.getBoundingClientRect().x;
            var startX: any = corSTarget?.getBoundingClientRect().x;
            var endX: any = corETarget?.getBoundingClientRect().x;
            var endWidthX: any = corETarget?.getBoundingClientRect().width;
            var theMargin = +startX - +absoluteX;
            var theWidth = +endX + +endWidthX - +startX;
            //calculations.. END
            //set calculations to element
            thisElement.setAttribute("style", "margin-left: "+ +theMargin +"px; width: "+ +theWidth +"px; background: red; border: solid thin black;");
        }
    }
};

var element = {
    type: Object.assign(
        (elm: any) => {
            //window.alert(elm.constructor.name)
            return elm.constructor.name
        },
        {
            control: function(toCheck: any, toControl: any ): boolean{
                var returnType = false;
                if(toCheck.constructor.name ==  toControl.prototype.constructor.name == true){
                    returnType = true;
                }
                //window.alert(returnType + " " + toCheck.constructor.name + " " + toControl.prototype.constructor.name)
                return returnType;
            }
        }
    )
}

var sliderVars = {
    state: false,
}

//end of custom functions

interface assignmentType {id: number, subject: string, title: string, start: Date, end: Date, canEdit: boolean}


export class DCGanttCalendar implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    //debugging variables

    // Value of the field is stored and used inside the control

    private _errors: boolean;

    private _startDate: Date;

    private _endDate: Date;

    private _dayWidth: Float64Array | Number;

    private _dayHeight: Float64Array | Number;
    //private _dayWidthControl: Float64Array | Number;

    // Reference to ComponentFramework Context object
    private _context: ComponentFramework.Context<IInputs>;

    // Reference to the control container HTMLDivElement
    // This element contains all elements of our custom control example
    private _container: HTMLDivElement;

    private _timeContent: HTMLDivElement;

    //calendar background elements
    //this is the table element used for the calendar background.
    private _table: HTMLTableElement;

    //thead element
    private _tableHead: HTMLTableSectionElement;

    //tbody element
    private _tableBody: HTMLTableSectionElement;

    //elements for the subjects
    //subject table element
    private _subjectTable: HTMLTableElement;

    //tbody element for the subjects
    private _subjectBody: HTMLTableSectionElement;

    //this is the table container for all the calendar related elements
    private _row: HTMLDivElement;

    //collection of all the subjects from context IInput
    private _subjects: string[];
    //collection of all the assignments from context IInput
    private _assignments: assignmentType[];
    //collection of created assignment elements, used when updating values and position
    private _assignmentElements: HTMLTableCellElement[];

    //timeline Scope scroll bar element
    private _scope: HTMLDivElement;
    //scopes click event for nav left and right
    private _clickEvent:EventListenerOrEventListenerObject;

    private _cellWidth: number;



    /**
     * Empty constructor.
     */
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
        //set values from components context IInputs
        this._errors = context.parameters.displayErrors.raw ?? true;
        this._startDate = context.parameters.startDate.raw ?? new Date(); //set _startDate value to context parameter startDate, if null default to new date
        this._endDate = context.parameters.endDate.raw ?? new Date((new Date()).getDate() + 1); //set _endDate value to context parameter endDate, if null default to new date
        this._dayWidth = context.parameters.dayWidth.raw ?? new Float64Array(); //set _dayWidth value to context parameter dayWidth, if null default to new number
        this._subjects = ["Welding", "Lathing", "Drilling", "Milling"];
        this._assignments = [
            { id: 0, subject: "Welding", title: "Stick Welding", start: (new Date("03.02.2023")), end: (new Date("03.06.2023")), canEdit: true},
            { id: 1, subject: "Welding", title: "Tig Welding", start: (new Date("03.25.2023")), end: (new Date("04.28.2023")), canEdit: true},
            { id: 2, subject: "Lathing", title: "Cone Lathing", start: (new Date("03.02.2023")), end: (new Date("03.23.2023")), canEdit: true},
            { id: 3, subject: "Lathing", title: "Centering", start: (new Date("03.25.2023")), end: (new Date("04.28.2023")), canEdit: false},
            { id: 4, subject: "Drilling", title: "Punching", start: (new Date("03.03.2023")), end: (new Date("03.20.2023")), canEdit: true},
            { id: 5, subject: "Drilling", title: "Boring", start: (new Date("03.21.2023")), end: (new Date("04.24.2023")), canEdit: true},
            { id: 6, subject: "Milling", title: "Positioning", start: (new Date("03.04.2023")), end: (new Date("04.18.2023")), canEdit: false},
            { id: 7, subject: "Milling", title: "Zeroing", start: (new Date("04.19.2023")), end: (new Date("04.24.2023")), canEdit: false}
        ];
        //set controll variable values
        //generate array from start date to end date
        var dates = getDaysArray(this._startDate, this._endDate);

        //lets the resize of the component inside power apps update the container value on resize
        context.mode.trackContainerResize(true);
        //set contexts
        //create div element container type for entire component
        this._container = document.createElement("div");
        // Add control initialization code
        
        //create div with class row used in bootstrap
        this._row = document.createElement("div"); this._row.classList.add("tableContainer", "row", "col-md-11");
        //create new table for row div element
        this._table = document.createElement("table");
        this._table.classList.add("table-dark"); //add bootstrap class to table element
        //create table head element for new table
        var _tableHead = this._table.createTHead();
        //create table body element for new table
        var _tableBody = this._table.createTBody();
        //creating variable to be set/used on table cell width/height
        var dayWidthToUse = dayWidthValue.check(+this._dayWidth);
        var dayHeightToUse = +(this._subjects.length * 2);
        this._dayHeight = +dayHeightToUse;
        //creating table for subjects
        var subjectsContainer = document.createElement("div"); subjectsContainer.classList.add("col-md-1", "subjectsContainer");
        this._subjectTable = subjectsContainer.appendChild(document.createElement("table"));
        this._subjectTable.classList.add("table-dark");
        this._subjectBody = this._subjectTable.createTBody();
        this._subjectBody.classList.add("text-center");
        createSubject.rows(this._subjects, this._subjectBody);
        


        var tableHtr = _tableHead.appendChild(createTableRowData(dayWidthToUse, dates, true));
        tableHtr.setAttribute("id", "table-head-row");

        var tableBtr = _tableBody.appendChild(createTableRowData(+this._dayHeight, dates, false));
        tableBtr.setAttribute("id", "table-body-row"); 

        //this._value = context.parameters.startDate.raw + _string.empty; //random calculation for testing purposes

        //this._container.innerText = this._value;
        this._container.classList.add("bg-secondary", "text-light", "container-fluid", "pageContainer"); //add bootstrap classes to element
        this._container.id = "pageContainer";
        this._timeContent = this._container.appendChild(document.createElement("div"));
        this._timeContent.classList.add("contentContainer", "row");



        //appendChild section
        container.appendChild(this._container); //set created container as child for component element
        this._timeContent.appendChild(subjectsContainer);
        this._timeContent.appendChild(this._row); //set row div element as child for created container
        this._row.appendChild(this._table); //set created table as child of table element
        //set min-height for contentContainer to height
        this._timeContent.style.minHeight = `${subjectsContainer.offsetHeight}px`;


        //scope - scroll in timeline 
        //create scrollbar that sticks to the botom of the window at all times
        this._scope = this._container.appendChild(document.createElement("div"));
        this._scope.id = "scopeElm";
        this._scope.classList.add("timelineScope");

        //scope - scroll
        //scope settings
        this.scopeFunc.target = this._timeContent;
        this.scopeFunc.cellW = (tableHtr.firstChild as HTMLTableCellElement).offsetWidth;
        //scope elements
        //scope navigate left
        var scopeLeft = this._scope.appendChild(document.createElement("div")); scopeLeft.classList.add("scopeLeft");

        var scopeAlgL = scopeLeft.appendChild(document.createElement("button")); scopeAlgL.classList.add("navLeft", "btn", "btn-dark");
        scopeAlgL.id = "algLeft";
        var scopeAlgLText = scopeAlgL.appendChild(document.createElement("p")); scopeAlgLText.textContent = "⟝";
        scopeAlgL.addEventListener("click", this.scopeFunc.align.start.bind(this));

        var scopeJmpL = scopeLeft.appendChild(document.createElement("button")); scopeJmpL.classList.add("navLeft", "btn", "btn-dark");
        scopeJmpL.id = "jmpLeft";
        var scopeJmpLText = scopeJmpL.appendChild(document.createElement("p")); scopeJmpLText.textContent = "⟪";
        scopeJmpL.addEventListener("click", this.scopeFunc.jump.left.bind(this));

        var scopeNavL = scopeLeft.appendChild(document.createElement("button")); scopeNavL.classList.add("navLeft", "btn", "btn-dark");
        scopeNavL.id = "navLeft";
        var scopeNavLText = scopeNavL.appendChild(document.createElement("p")); scopeNavLText.textContent = "⟨";
        scopeNavL.addEventListener('click', this.scopeFunc.step.left.bind(this));

        //scope center /background
        var scopeC = this._scope.appendChild(document.createElement("div")); scopeC.classList.add("scopeCenter");
        scopeC.addEventListener("scroll", this.scopeFunc.scroll.bind(this));


        this.scopeFunc.setup.subjects(this._subjects, scopeC);
        this.scopeFunc.setup.dates(dates, scopeC);
        this.scopeFunc.setup.assignments(this._assignments, scopeC);
        console.log("days count = " + dates.length);
        
        //scope navigate right
        var scopeRight = this._scope.appendChild(document.createElement("div")); scopeRight.classList.add("scopeRight");

        var scopeNavR = scopeRight.appendChild(document.createElement("button")); scopeNavR.classList.add("navRight", "btn", "btn-dark");
        var scopeNavRText = scopeNavR.appendChild(document.createElement("p")); scopeNavRText.textContent = "⟩";
        scopeNavR.id = "navRight";
        scopeNavR.addEventListener('click', this.scopeFunc.step.right.bind(this));

        var scopeJmpR = scopeRight.appendChild(document.createElement("button")); scopeJmpR.classList.add("navRight", "btn", "btn-dark");
        scopeJmpR.id = "jmpRight";
        var scopeJmpRText = scopeJmpR.appendChild(document.createElement("p")); scopeJmpRText.textContent = "⟫";
        scopeJmpR.addEventListener("click", this.scopeFunc.jump.right.bind(this));

        var scopeAlgR = scopeRight.appendChild(document.createElement("button")); scopeAlgR.classList.add("navRight", "btn", "btn-dark");
        scopeAlgR.id = "algRight";
        var scopeAlgRText = scopeAlgR.appendChild(document.createElement("p")); scopeAlgRText.textContent = "⟞";
        scopeAlgR.addEventListener("click", this.scopeFunc.align.end.bind(this));
        
        //finish making assignments
        this._assignmentElements = createSubject.assignment(this._assignments);
        createSubject.positioning(this._assignments, this._assignmentElements, false);

        //bind function to check if Left Mouse Button was released, used to stop drag and other events
        document.addEventListener('mouseup', this.mouseButtonRelease.bind(this));
        

        //set scroll values for scope
        
    }

    //custom functions for scope
    private scopeFunc = {
        target: document.body as HTMLElement,
        cellW: 0,
        state: false,
        scroll: (event: any): void => {
            var tarThumbW = this.scopeFunc.target.offsetWidth / this.scopeFunc.target.scrollWidth;
            var evTarThumbW = event.target.offsetWidth / event.target.scrollWidth;
            var tarPerc = (this.scopeFunc.target.scrollWidth - tarThumbW) / 100;
            var evTarPerc = (event.target.scrollWidth - evTarThumbW) / 100;
            console.log("values: " + evTarPerc + " " + event.target.scrollLeft + " " + tarPerc + " result: " + evTarPerc * (event.target.scrollLeft / tarPerc) +" ")
            this.scopeFunc.target.scrollLeft = Math.floor(((this.scopeFunc.target.scrollWidth - this.scopeFunc.target.clientWidth) / 100) * (event.target.scrollLeft / ((event.target.scrollWidth - event.target.clientWidth) / 100)));
        },
        step: {
            left: (): void => {
                let cellWidth = (this._tableHead.firstChild?.firstChild as HTMLTableCellElement).offsetWidth;
                this.scopeFunc.target.scrollLeft = this.scopeFunc.target.scrollLeft - cellWidth;
            },
            right: (): void => {
                let cellWidth = (this._tableHead.firstChild?.firstChild as HTMLTableCellElement).offsetWidth;
                this.scopeFunc.target.scrollLeft = this.scopeFunc.target.scrollLeft + cellWidth;
            }
        },
        align: {
            center: (): void =>{
                this.scopeFunc.target.scrollLeft = this.scopeFunc.target.scrollWidth / 2;
            },
            start: (): void => {
                this.scopeFunc.target.scrollLeft = 0;
            },
            end: (): void => {
                this.scopeFunc.target.scrollLeft = this.scopeFunc.target.scrollWidth;
            },
            today: (target: HTMLElement): void =>{
                
                var findToday = (target.querySelector("[title='"+ (new Date).toDateString() +"']"));
                if(findToday != null){
                    target.scrollLeft = 0;
                    findToday = findToday as HTMLTableCellElement;
                    var todayBound = findToday.getBoundingClientRect();
                    var targetBound = target.getBoundingClientRect();
                    target.scrollLeft = todayBound.x - (targetBound.width / 2);
                }else{
                    if (this._errors){
                        window.alert("Couldn't find todays date in the calendar!\nPlease consult the administrator for your team.\nError Code: \"001001\"");
                    }
                }
            }
        },
        jump: {
            right: (): void => {
                var jumpTimes = Math.floor(this.scopeFunc.target.offsetWidth / this.scopeFunc.cellW);
                this.scopeFunc.target.scrollLeft = this.scopeFunc.target.scrollLeft + (this.scopeFunc.cellW * jumpTimes); 
                
            },
            left: (): void => {
                var jumpTimes = Math.floor(this.scopeFunc.target.offsetWidth / this.scopeFunc.cellW);
                this.scopeFunc.target.scrollLeft = this.scopeFunc.target.scrollLeft - (this.scopeFunc.cellW * jumpTimes);
            }
        },
        setup: {
            subjects: (subjects: string[], target: HTMLElement): void =>{
                var scopeCSub = target.appendChild(document.createElement("div").appendChild(document.createElement("table")));
                var scopeCSubTB = scopeCSub.createTBody();
                var subjectHeight = (this.scopeFunc.target.querySelector("[id='"+ subjects[1]+ "']") as HTMLTableRowElement).getBoundingClientRect().height;
                var countHeight = Math.floor(Math.floor(target.getBoundingClientRect().height) / Math.floor(subjectHeight))
                var trHeight = Math.floor(scopeCSub.getBoundingClientRect().height / countHeight);
                for(let i = 0; i < subjects.length; i++){
                    var subj = subjects[i];
                    var scopeSubject = scopeCSubTB.insertRow();
                    scopeSubject.style.minHeight = trHeight +'px';
                    scopeSubject.style.maxHeight = scopeCSub.getBoundingClientRect().height - 2 +'px';
                    scopeSubject.style.height = trHeight +'px';
                    scopeSubject.classList.add("scopeSubject");
                    scopeSubject.id = "scope-" + subj;
                }
            },
            dates: (dates: Date[], target: HTMLElement): void =>{
                for(let i = 0; i < dates.length; i++){
                    let disDate = dates[i] as Date;
                    var dai = target.appendChild(document.createElement("div"));
                    dai.setAttribute("scopedate", disDate.toDateString());
                }
            },
            assignments: (assignments: assignmentType[], target: HTMLElement): void =>{
                for(let i = 0; i < assignments.length; i++){
                    var assign = assignments[i];
                    var myScopeSubject = target.querySelector("[id='scope-"+ assign.subject +"']") as HTMLTableRowElement;
                    var assignCell = myScopeSubject.insertCell();
                    var sElm = (target.querySelector("[scopedate='"+ assign.start.toDateString() +"']") as HTMLDivElement).getBoundingClientRect();
                    var eElm = (target.querySelector("[scopedate='"+ assign.end.toDateString() +"']") as HTMLDivElement).getBoundingClientRect();
                    var slElmX = assignCell.getBoundingClientRect().x;
                    assignCell.style.width = Math.floor(eElm.x + eElm.width - sElm.x -1) +"px";
                    assignCell.style.marginLeft = Math.floor(sElm.x - slElmX -1) +"px";
                    assignCell.classList.add("scopeAssignment");
                    assignCell.setAttribute("assignment-title", assign.title);
        
                }
            }

        }
    }

    private mouseButtonRelease( event: MouseEvent ): void{
        switch (event.button){
            case 0: sliderVars.state = false; break; //left mouse button
            case 1: this.scopeFunc.align.center(); break; //middle mouse buttone
            case 2: this.scopeFunc.align.today(this.scopeFunc.target); break; //right mouse button
        }
    }

    


    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void
    {       //console.log("updating view");



        // Add code to update control view
        //set control container size to component's height and width
        this._container.style.height = `${context.mode.allocatedHeight}px`;
        this._container.style.width = `${context.mode.allocatedWidth}px`;
        //this._timeContent.style.minWidth = `${context.mode.allocatedHeight}px`;
        this._context = context;
        //check if dates has been altered
        var endDateControl = context.parameters.endDate.raw ?? new Date((new Date()).getDate() + 1); 
        var startDateControl = context.parameters.endDate.raw ?? new Date((new Date()).setDate(new Date().getDate() - 1));
        if(this._endDate != endDateControl || this._startDate != startDateControl ){//check is if related context params are no longer equal to the stored variables
            this._endDate = context.parameters.endDate.raw ?? new Date((new Date()).getDate() + 1); //set variable to the updated related context parameter value
            //this._endDate.setDate((this._endDate).getDate() + 1);
            this._startDate = context.parameters.startDate.raw ?? new Date(); //set variable to the updated related context parameter value

            this._tableHead = document.getElementById("table-head-row")?.parentElement as HTMLTableSectionElement; //remove table head element's children
            this._tableHead.innerHTML = _string.empty;
            this._tableBody = document.getElementById("table-body-row")?.parentElement as HTMLTableSectionElement;
            this._tableBody.innerHTML = _string.empty; //remove table body element's children

            var dates = getDaysArray(this._startDate, this._endDate); //generate array of dates between start date and end date

            var tableTr = createTableRowData(+this._dayWidth, dates, true);
            tableTr.id = "table-head-row";
            this._tableHead.appendChild(tableTr); //append generated table row and cells to table header element
            tableTr = createTableRowData(+this._dayWidth, dates, false);
            tableTr.id = "table-body-row";
            this._tableBody.appendChild(tableTr); //append generated table row and cells to table body element

            createSubject.positioning(this._assignments, this._assignmentElements, true); //update assignments positioning
            
        }

        //console.log(this._dayWidth + " : " + this._dayWidthControl);
        //check if dayWidth has been changedWidth has been changed by checking if dayWidth is not equal to the dayWidthControl variable
        var dayWidthControl = context.parameters.dayWidth.raw as number;
        if(dayWidthControl.toString.length > 0  && this._dayWidth != dayWidthControl && +dayWidthControl > dayWidthValue.min){ //check if the _dayWidth is changed and valid
            //console.log("editing now... Changing '" + dayWidthControl + "' to '" + this._dayWidth + "'."); //console logging for debug purposes
            this._dayWidth = dayWidthControl;
            let table = document.getElementById("table-head-row") as HTMLTableRowElement; //define a variable to table row that has the id "table-head-row", and specify type as compatible html dom type
            let tableChildren = Array.prototype.slice.call( table.children ); //define variable as array where the children from variable table is sliced into an array
            var dayWidthToUse = dayWidthValue.check(+this._dayWidth); //define variable as float to be used in styling for table row cell in table head element
            this._dayWidth = dayWidthToUse; //change stored value of _datWidth to new value
            for(const child of tableChildren){ //define variable to be changed for each element inside tableChildren
                child.setAttribute("style", "min-width: " + dayWidthToUse + "rem !important; max-width: " + dayWidthToUse + "rem !important"); //set new style for defined element
                //console.log(child);
            }
            createSubject.positioning(this._assignments, this._assignmentElements, true); //update assignments positioning
        }
        
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
