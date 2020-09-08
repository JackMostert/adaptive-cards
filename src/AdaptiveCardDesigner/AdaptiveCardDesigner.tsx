import * as React from "react";
import * as Monaco from "monaco-editor";
import * as ACDesigner from "adaptivecards-designer";
import * as ACTemplating from "adaptivecards-templating";
import * as ACFabric from "adaptivecards-fabric";
import { Text } from "office-ui-fabric-react";
import _ from "lodash";

import "./AdaptiveCardDesigner.css";
import "adaptivecards-designer/dist/adaptivecards-defaulthost.css";
import "adaptivecards-designer/dist/adaptivecards-designer.css";

import { ToolbarChoicePicker } from "adaptivecards-designer";
import { ISavedCard, ISiteEl } from "../App";
import { setLocalStorageValue } from "../Functions";

let MarkdownIt = require("markdown-it");

export interface IAdaptiveCardDesignerProps {
  history: any;

  selectedSiteFileElements: Array<any>;
  updateLocalState: (key: string, value: any) => void;
  savedCards?: Array<ISavedCard>;
  sitefile: string | object | undefined;
  siteFileElements?: Array<ISiteEl>;
  currentEditingCard: {
    cardSchema: {
      title?: string;
      type: "AdaptiveCard";
      version: "1.0";
      body: any;
    };
    cardData: any;
  };
}

export interface IAdaptiveCardDesignerState {}

export default class AdaptiveCardDesigner extends React.Component<
  IAdaptiveCardDesignerProps,
  IAdaptiveCardDesignerState
> {
  public Element = React.createRef<any>();
  private designer: any;

  private availableCards: ACDesigner.ToolbarChoicePicker = new ACDesigner.ToolbarChoicePicker(
    "availableCards"
  );

  private savedCards: ACDesigner.ToolbarChoicePicker = new ACDesigner.ToolbarChoicePicker(
    "savedCards"
  );

  componentDidMount() {
    if (!this.props.sitefile) return;
    // ACFabric.useFabricComponents();
    let HTMLContainer = document.getElementById("designerRootHost");

    ACTemplating.GlobalSettings.undefinedExpressionValueSubstitutionString =
      "<undefined value>";
    ACDesigner.GlobalSettings.showVersionPicker = false;
    ACDesigner.GlobalSettings.enableDataBindingSupport = true;
    ACDesigner.GlobalSettings.showDataStructureToolbox = true;
    ACDesigner.GlobalSettings.showSampleDataEditorToolbox = true;

    ACDesigner.Strings.toolboxes.cardEditor.title = "Card Schema JSON Editor";
    ACDesigner.Strings.toolboxes.cardStructure.title = "Card Structure";
    ACDesigner.Strings.toolboxes.dataStructure.title =
      "Custom data structure title";
    ACDesigner.Strings.toolboxes.propertySheet.title = "Component Properties";
    ACDesigner.Strings.toolboxes.sampleDataEditor.title = "Card Schema";
    ACDesigner.Strings.toolboxes.toolPalette.title = "Components";

    ACDesigner.CardDesigner.onProcessMarkdown = (text, result) => {
      result.outputHtml = new MarkdownIt().render(text);
      result.didProcess = true;
    };

    if (!ACDesigner.SettingsManager.isLocalStorageAvailable) {
      console.log("Local storage is not available.");
    }

    this.designer = new ACDesigner.CardDesigner(
      ACDesigner.defaultMicrosoftHosts
    );
    this.designer.assetPath = "http://localhost:3000/";

    //

    this.availableCards.label = "Available Cards:";
    this.availableCards.separator = true;
    this.availableCards.width = 200;
    this.availableCards.onChanged = (sender: ToolbarChoicePicker) => {
      let choice = _.filter(
        sender.choices,
        (choice, index) => index === sender.selectedIndex
      );

      if (!choice[0].value) return;
      this.props.updateLocalState("selectedSiteFileElements", choice[0].value);

      let cardSchema: any = {
        title: choice[0].name,
        type: "AdaptiveCard",
        version: "1.0",
        body: [],
      };

      _.map(choice[0].value, (el: any) => {
        cardSchema.body.push(el.snippet);
      });

      this.props.updateLocalState("currentEditingCard", {
        cardSchema: cardSchema,
        cardData: {},
      });
    };

    _.map(this.props.siteFileElements, (el: ISiteEl) => {
      this.availableCards.choices.push({
        name: el.title,
        value: el.elements,
      });
    });

    this.designer.toolbar.insertElementAfter(
      this.availableCards,
      ACDesigner.CardDesigner.ToolbarCommands.Redo
    );

    //

    this.savedCards.label = "Saved Cards:";
    this.savedCards.separator = true;
    this.savedCards.width = 200;
    this.savedCards.onChanged = (sender: ToolbarChoicePicker) => {
      let choice: any = _.filter(
        sender.choices,
        (choice, index) => index === sender.selectedIndex
      );

      let data = JSON.parse(choice[0].value);
      this.props.updateLocalState("currentEditingCard", {
        cardSchema: data.cardSchema,
        cardData: !!data.cardData ? data.cardData : undefined,
      });
    };

    _.map(this.props.savedCards, (el: any) => {
      if (typeof el !== "string") {
        this.savedCards.choices.push({
          name: el.title,
          value: JSON.stringify(el.value),
        });
      } else {
        let [local] = JSON.parse(el);

        this.savedCards.choices.push({
          name: local.title,
          value: JSON.stringify(local.value),
        });
      }
    });

    this.designer.toolbar.insertElementAfter(
      this.savedCards,
      ACDesigner.CardDesigner.ToolbarCommands.Redo
    );

    //

    let myButton = new ACDesigner.ToolbarButton(
      "myButton",
      "View Card",
      "",
      (sender: any) => {
        this.props.updateLocalState("showroomCard", {
          title: "",
          value: {
            cardSchema: this.designer.getCard(),
            cardData: this.designer.sampleData,
          },
        });
        this.props.history.push("/designer/viewCard");
      }
    );
    myButton.separator = true;
    myButton.iconClass = "ms-Icon--View";
    this.designer.toolbar.insertElementAfter(myButton, "__togglePreviewButton");

    //

    let saveBTN = new ACDesigner.ToolbarButton(
      "saveBTN",
      "Save Card",
      "",
      (sender: any) => {
        setLocalStorageValue(
          "savedCards",
          JSON.stringify([
            {
              title: this.designer.getCard().title || "",
              value: {
                cardData: !!this.designer.sampleData
                  ? this.designer.sampleData
                  : undefined,
                cardSchema: this.designer.getCard(),
              },
            },
          ])
        );
        this.props.updateLocalState("savedCards", {
          title: this.designer.getCard().title || "",
          value: {
            cardData: !!this.designer.sampleData
              ? this.designer.sampleData
              : undefined,
            cardSchema: this.designer.getCard(),
          },
        });
      }
    );
    saveBTN.separator = true;
    saveBTN.iconClass = "ms-Icon--Save";
    this.designer.toolbar.insertElementAfter(saveBTN, "__togglePreviewButton");

    //

    this.designer.toolbar.getElementById("__openPayload").isVisible = false;

    this.designer.toolbar.getElementById(
      "__togglePreviewButton"
    ).isVisible = false;

    this.designer.toolbar.getElementById(
      ACDesigner.CardDesigner.ToolbarCommands.CopyJSON
    ).isVisible = false;

    if (HTMLContainer) {
      this.designer.attachTo(HTMLContainer);
    }

    this.designer.monacoModuleLoaded(Monaco);
    this.designer.setCard(this.props.currentEditingCard.cardSchema);
  }

  componentWillReceiveProps(props: IAdaptiveCardDesignerProps) {
    if (!props.selectedSiteFileElements) return;
    this.designer.customPaletteItems = props.selectedSiteFileElements;

    this.designer.setCard(props.currentEditingCard.cardSchema);
    this.designer.sampleData = props.currentEditingCard.cardData || {};
  }

  public render() {
    if (!this.props.sitefile)
      return (
        <Text
          variant="xxLarge"
          style={{
            color: "red",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Please add a JSON Formatted site-file
        </Text>
      );
    return <div id="designerRootHost" className="AdaptiveCardDesigner"></div>;
  }
}
