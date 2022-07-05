/*!
 * Form services/utilities (Vue)
 * File: forms.services.js
 * Copyright(c) 2022 BC Gov
 * MIT Licensed
 */

const schemaData = {
  registrationSelection: [
    { field: "organization", text: "Organization" },
    { field: "branch", text: "Branch" },
    { field: "primarycontact", text: "Primary Contact" },
    { field: "primaryemail", text: "Primary Contact's Email" },
    { field: "financialcontact", text: "Financial Contact" },
    { field: "clientministry", text: "Client/Ministry Code" },
    { field: "respcode", text: "RESP Code" },
    { field: "serviceline", text: "Service Line" },
    { field: "stob", text: "STOB" },
    { field: "project", text: "Project Code" },
  ],
  guestSelection: [
    { field: "organization", text: "Organization" },
    { field: "firstname", text: "First Name" },
    { field: "lastname", text: "Last Name" },
    { field: "attendancetype", text: "Attendance Type" },
    { field: "accessibility", text: "Accessibility Requirements" },
    { field: "dietary", text: "Dietary Requirements" },
  ],
  roles: [
    { value: null, text: "Please select a user role" },
    { value: "inactive", text: "Inactive" },
    { value: "registrar", text: "Registrar" },
    { value: "administrator", text: "Administrator" },
    { value: "super-administrator", text: "Super-Administrator" },
  ],
  organizations: [
    { value: null, text: "Please select an eligible Ministry or organization" },
    { value: "org-1", text: "Advanced Education and Skills Training" },
    { value: "org-2", text: "Agriculture, Food and Fisheries" },
    { value: "org-3", text: "Attorney General & Housing" },
    { value: "org-4", text: "Children and Family Development" },
    { value: "org-5", text: "Citizens’ Services" },
    { value: "org-6", text: "Education" },
    { value: "org-7", text: "Emergency Management BC" },
    { value: "org-8", text: "Energy, Mines and Low Carbon Innovation" },
    { value: "org-9", text: "Environment and Climate Change Strategy" },
    { value: "org-10", text: "Environment Assessment Office" },
    { value: "org-11", text: "Finance" },
    {
      value: "org-12",
      text: "Forests, Lands, Natural Resource Operations and Rural Development",
    },
    { value: "org-13", text: "Health" },
    { value: "org-14", text: "Indigenous Relations and Reconciliation" },
    { value: "org-15", text: "Jobs, Economic Recovery and Innovation" },
    { value: "org-16", text: "Labour" },
    { value: "org-17", text: "Mental Health & Addictions" },
    { value: "org-18", text: "Municipal Affairs" },
    { value: "org-19", text: "Public Safety & Solicitor General" },
    { value: "org-20", text: "Social Development & Poverty Reduction" },
    { value: "org-21", text: "Tourism, Arts, Culture and Sport" },
    { value: "org-22", text: "Transportation & Infrastructure" },
    { value: "org-23", text: "BC Public Service Agency" },
    {
      value: "org-24",
      text: "Government Communications and Public Engagement",
    },
    { value: "org-25", text: "Office of the Premier" },
  ],
  attendancetypes: [
    { value: "minister", text: "Minister" },
    { value: "deputyminister", text: "Deputy Minister" },
    { value: "associateminister", text: "Associate/Assistant Deputy Minister" },
    { value: "finalist", text: "Finalist" },
    { value: "finalistguest", text: "Finalist Guest" },
    { value: "generalattendee", text: "General Attendee" },
  ],
  dietaryoptions: [
    { value: "dairyfree", text: "Dairy-Free" },
    { value: "glutenfree", text: "Gluten-Free" },
    { value: "sugarfree", text: "Sugar-Free" },
    { value: "shellfishfree", text: "Shellfish-Free" },
    { value: "vegetarian", text: "Vegetarian" },
    { value: "vegan", text: "Vegan" },
    { value: "peanutfree", text: "Peanut-Free" },
    { value: "nutfree", text: "Nut-Free" },
    { value: "other", text: "Other" },
  ],
  accessibilityoptions: [
    { value: "wheelchairrequired", text: "Wheelchair Required" },
    { value: "attendantrequired", text: "Attendant Required" },
    { value: "mobilityneeds", text: "Mobility Needs" },
  ],
};

export default {
  /**
   * get enumerated data by key
   * **/

  get: function get(key) {
    return schemaData[key] !== "undefined" ? schemaData[key] : null;
  },

  /**
   * get enumerated data by key
   * **/

  lookup: function lookup(key, value) {
    if (schemaData[key] === "undefined") return null;
    const found = schemaData[key].filter((item) => item.value === value);
    return found.length > 0 ? found[0].text : null;
  },
};
