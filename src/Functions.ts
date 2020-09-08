import * as ACDesigner from "adaptivecards-designer";
import _ from "lodash";

const blacklist = [
  "Principals",
  "Notes",
  "Dependencies",
  "Process Diagrams",
  "Process Runs",
  "Process Artifacts",
  "Database Migrations",
  "Universal Links",
];

export const parseSiteFileData = (lists: any[]) => {
  let entities: any = [];

  lists = removeBlacklistItems(lists, entities);

  for (let i = 0; i < lists.length; i++) {
    const element = lists[i];
    _.map(element.Fields, (field) => {
      let payload: any = {
        type: "",
        weight: "Bolder",
        size: "Medium",
        id: Math.random(),
        isVisible: true,
        value: `{${field.ColumnName}}`,
        defaultValue: `{${field.ColumnName}}`,
      };

      switch (field.FieldType) {
        case "Text":
          payload.type = "Input.Text";
          break;
        case "Lookup":
          payload.type = "Input.ChoiceSet";
          payload["choices"] = [];
          payload.choices.push({
            title: "Select...",
            value: "gg",
          });
          break;
        case "Boolean":
          payload.type = "Input.Toggle";
          payload.title = field.Title;
          payload.wrap = false;
          break;
        case "Number":
          payload.type = "Input.Number";
          break;
        case "Percentage":
          payload.type = "Input.Number";
          break;
        case "Currency":
          payload.type = "Input.Number";
          break;
        case "Integer":
          payload.type = "Input.Number";
          break;
        case "DateTime":
          payload.type = "Input.Date";
          break;
        case "Note":
          payload.type = "Input.Text";
          payload["isMultiline"] = true;
          break;
        case "Email":
          payload.type = "Input.Text";
          break;
        case "User":
          payload.type = "Input.ChoiceSet";
          payload["choices"] = [];
          payload.choices.push({
            title: "Select...",
            value: "gg",
          });
          break;
        case "Subquery":
        case "JSON":
          payload.type = "Input.Text";
          payload.isVisible = false;
          break;
        case "Choice":
          payload.type = "Input.ChoiceSet";
          payload["choices"] = [];
          _.map(field.Settings.Choices, (choice) => {
            payload.choices.push({
              title: choice.Text,
              value: choice.Text,
            });
          });
          break;
      }

      let cardElement = new ACDesigner.SnippetPaletteItem(
        element.ListName,
        field.Title
      );
      cardElement.snippet = {
        type: "ColumnSet",
        columns: [
          {
            width: "stretch",
            items: [
              {
                type: "TextBlock",
                text: field.Title,
                size: "Medium",
                weight: "Bolder",
                color: "Accent",
              },
              { ...payload },
            ],
          },
        ],
      };
      entities[element.ListName].push(cardElement);
    });
  }

  return entities;
};

const removeBlacklistItems = (lists: any[], entities: any) =>
  _.filter(lists, (el) => {
    for (let i = 0; i < blacklist.length; i++) {
      if (el.ListName === blacklist[i]) return false;
    }
    entities[el.ListName] = [];
    return true;
  });

export const getFromLoaclStorage = (key: string): any[] | undefined => {
  const localStorage = window.localStorage.getItem(key);
  if (!localStorage) return undefined;
  return JSON.parse(localStorage);
};

export const setLocalStorageValue = (
  key: string,
  value: any,
  override?: boolean
) => {
  const stringValue = JSON.stringify([value]);
  const state = getFromLoaclStorage(key);

  if (!state || override) {
    window.localStorage.setItem(key, stringValue);
  } else {
    window.localStorage.setItem(key, JSON.stringify(state.concat([value])));
  }
};
