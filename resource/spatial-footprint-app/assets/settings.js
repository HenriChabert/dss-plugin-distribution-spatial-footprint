export default
[
  {
    "type": "radio",
    "label": "Choose your analysis",
    "name": "analysisType",
    "choices": [
      {
        "label": "Properties",
        "value": "properties"
      },
      {
        "label": "Competition",
        "value": "competition"
      }
    ],
    "inlineChoices": true,
    "defaultValue": "properties"
  },
  {
    "type": "custom",
    "componentName": "isochrone-picker",
    "name": "isochrones",
    "label": "Select the isochrones to display :",
    "getChoicesFromBackend": true,
    "defaultValue": []
  },
  {
    "type": "select",
    "label": "Location to focus on",
    "name": "focusLocation",
    "placeholder": "Select a location...",
    "getChoicesFromBackend": true
  },
  {
    "type": "switch",
    "label": "Display customers",
    "name": "displayCustomers"
  },
  {
    "type": "switch",
    "label": "Display points of interest",
    "name": "displayPOI"
  }
]