/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    startDate: ComponentFramework.PropertyTypes.DateTimeProperty;
    endDate: ComponentFramework.PropertyTypes.DateTimeProperty;
    dayWidth: ComponentFramework.PropertyTypes.DecimalNumberProperty;
}
export interface IOutputs {
    startDate?: Date;
    endDate?: Date;
    dayWidth?: number;
}
