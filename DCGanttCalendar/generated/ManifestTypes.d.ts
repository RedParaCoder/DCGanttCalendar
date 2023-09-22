/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    displayErrors: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    startDate: ComponentFramework.PropertyTypes.DateTimeProperty;
    endDate: ComponentFramework.PropertyTypes.DateTimeProperty;
    dayWidth: ComponentFramework.PropertyTypes.DecimalNumberProperty;
    Assignments: ComponentFramework.PropertyTypes.DataSet;
    Subjects: ComponentFramework.PropertyTypes.DataSet;
}
export interface IOutputs {
    displayErrors?: boolean;
    startDate?: Date;
    endDate?: Date;
    dayWidth?: number;
}
