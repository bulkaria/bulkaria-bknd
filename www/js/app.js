var app = angular.module("bulkaria-bknd", ["ng-admin"]);

app.config(["AdminDescription", "NgAdminProvider", function (AdminDescription, NgAdminProvider) {
    var nga = AdminDescription;
    // set the main API endpoint for this admin
    var app = nga.application("bknd-app")
        .baseApiUrl("https://bulkaria-dev.firebaseio.com/");

    // define all entities at the top to allow references between them
    var group = nga.entity("groups.json") // the API endpoint for groups will be http://localhost:3000/groups/:id
        .identifier(nga.field("id")); // you can optionally customize the identifier used in the api ("id" by default)

    var user = nga.entity("users.json") 
        .identifier(nga.field("id")); 

    // set the application entities
    app.addEntity(group);
    app.addEntity(user);

    // customize entities and views

    group.dashboardView() // customize the dashboard panel for this entity
        .title("Recent groups")
        .order(1) // display the group panel first in the dashboard
        .perPage(5) // limit the panel to the 5 latest groups
        .fields([nga.field("name").isDetailLink(true).map(truncate)]); // fields() called with arguments add fields to the view

    group.listView()
        .title("All groups") // default title is "[Entity_name] list"
        .description("List of groups with infinite pagination") // description appears under the title
        .infinitePagination(true) // load pages as the user scrolls
        .fields([
            nga.field("id").label("ID"), // The default displayed name is the camelCase field name. label() overrides id
            nga.field("name"), // the default list field type is "string", and displays as a string
            nga.field("created", "date"), // Date field type allows date formatting
//            nga.field("views", "number"),
            nga.field("members", "reference_many") // a Reference is a particular type of field that references another entity
                .targetEntity(user) // the users entity is defined later in this file
                .targetField(nga.field("displayName")) // the field to be displayed in this list
        ])
        .listActions(["show", "edit", "delete"]);

    group.creationView()
        .fields([
            nga.field("name") // the default edit field type is "string", and displays as a text input
                .attributes({ placeholder: "the group name" }) // you can add custom attributes, too
                .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
            nga.field("description", "text"), // text field type translates to a textarea
            nga.field("note", "wysiwyg"), // overriding the type allows rich text editing for the body
            nga.field("created", "date") // Date field type translates to a datepicker
        ]);

    group.editionView()
        .title("Edit group '{{ entry.values.name }}'") // title() accepts a template string, which has access to the entry
        .actions(["list", "show", "delete"]) // choose which buttons appear in the top action bar. Show is disabled by default
        .fields([
            group.creationView().fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
            nga.field("members", "reference_many") // reference_many translates to a select multiple
                .targetEntity(user)
                .targetField(nga.field("displayName"))
                .cssClasses("col-sm-4"), // customize look and feel through CSS classes
//            nga.field("views", "number")
//                .cssClasses("col-sm-4"),
            nga.field("members", "referenced_list") // display list of related comments
                .targetEntity(user)
                .targetReferenceField("id")
                .targetFields([
                    nga.field("id"),
                    nga.field("displayName").label("Name")
                ])
        ]);

    group.showView() // a showView displays one entry in full page - allows to display more data than in a a list
        .fields([
            nga.field("id"),
            group.editionView().fields(), // reuse fields from another view in another order
            nga.field("custom_action", "template")
                .template("<other-page-link></other-link-link>")
        ]);

    nga.configure(app);  
}]);