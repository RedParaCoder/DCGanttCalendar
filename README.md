# DC-Gantt-Calendar
This is a work project that is built for Microsoft Power Apps, using the PCF Framework. The purpose of this code component is for students to have insight and planning for their classes and projects. This is mainly created for schools, but could work extremely well in an industrial or mass project oriented work place that utalize Microsoft Teams.
# PowerApps configuration
To use this properly in PowerApps you'll have to set specific data into the dataset fields #1 and #2.
#1 you can simply insert a formula that returns assignments which you can relate to this example: {ID: 1, Title: "MyAssignmentName", subject:{ID: 1, Title: "AssignmentTitle"}, description: "A description for the assignment." start: Date(02.02.2023), end: Date(14.04.2023), forced: true }.
#2 you can simply have a table that returns subjects that can relate to this example: {ID: 1, Title: "AssignmentTitle"}.
For #1 you'll have to click under the property to where is displays "Fields" you click "edit" and add at least (ID, Title, subject, description, start, end, forced) for the component to work properly.
For #2 you'll have to go into the components Advanced properties and locate the property-set "ID" and "Title" where you have to type inside the quotes the corelated subjects column names, for me I'll just type '"ID"' into the ID property, and '"Title"' into the Title property.

# SharePoint Lists
This is what lists I use for my current PowerApps Canvas App, All you need is two lists; Subjects, and Assignments. The way you use the component doesn't need to be the same as I do, but you need to be able to provide something that resembles Assignments, and Subjects for the compnent to work. The way I have it is for a school where teachers and students can edit and create assignments and at what times they want to schedule the assignments and time frames for the subject and assignments.
## My Lists
Yearframes, This will be a schools time frame of the students school year.
  Columns: ID, Title, start, end.
  (ID) is the unique identifier: Integer, (Title) is the simplified name for the time frame: String ex"2023/2024",
  (start) is the start date for the time frame: Date ex"07.07.2023", (end) is the end date for the time frame: Date ex"28.06.2024".

Fields, This is used to seperate the different fields the school has such as IT, Industrial, Medical.
  Columns: ID, Title, timeframe.
  (ID) is the unique identifier: Integer, (Title) is the name for that class's field: String ex"TIP1C",
  (timeframe) is the related time frame: Related field ex"Yearframes WHERE Yearframes.ID = 1" returns {ID, Title, start, end}.

FieldPrograms, This is all the types of programs the field is involved in, such as Academical subjects and its Field's subjects.
  Columns: ID, Title, field.
  (ID) is the unique identifier: Integer, (Title) is the name for the type of program: String ex"Field subjects",
  (field) is the relation to your field: Related field ex"Medical Field" returns {ID, Title, timeframe}.

Subject, the subjects you have in a specific field program such as English and Math or for the field specifics like Welding or Lathing.
  Columns: ID, Title, fieldProgram, start, end.
  (ID) is the unique identifier: Integer, (Title) is the name for the subject: String ex"Welding",
  (fieldProgram) is the related program for the field: Related field ex"FieldPrograms WHERE FieldPrograms.ID = 1" returns {ID, Title, field},
  (start) is the start for that subject's time frame, (end) is the end for that subject's time frame.

Assignments, This is where all the assignments goes such as Stick Welding for the Welding subject.
  Columns: ID, Title, subject, description, start, end, forced.
  (ID) is the unique identifier: Integer, (Title) is the name for the assignment: String ex"Stick Welding",
  (subject) is a relation to the assignments subject: Related field ex"Subjects WHERE Subjects.ID = 1" returns {ID, Title, field},
  (description) is the description for the assignment: String ex"Usage of stick welding to weld two sheetmetal plates together",
  (start) is the start of the time frame the assignment has: Date ex"29.08.2023",
  (end) is the end of the time frame the assignment has: Date ex"05.08.2023",
  (forced) is the state of the assignment whether you can edit when you want to work with it: Bool ex"TRUE".

UserAssignments, this is used for assignments that are not forced where students can create their own time frame for the assignment.
  Columns: ID, Title, assignment, start, end.
  (ID) is the unique identifier: Integer, (Title) is the name/identifier of the user: String ex"example@mail.com",
  (assignment) is the related assignment: Related field ex"Assignments WHERE Assignments.ID = 1" returns {ID, Title, subject, desctiption, start, end, forced},
  (start) is the start of the custom time frame: Date ex"01.03.2023",
  (end) is the end of the custom time frame: Date ez"31.03.2023".
