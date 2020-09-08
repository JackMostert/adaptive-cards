import React from "react";
import AdaptiveCardDesigner from "./AdaptiveCardDesigner/AdaptiveCardDesigner";
import { Nav } from "office-ui-fabric-react/lib/Nav";
import { getFromLoaclStorage, parseSiteFileData } from "./Functions";

import Doc from "./Doc";
import ShowRoom from "./ShowRoom";

import "./App.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { IFileWithMeta } from "react-dropzone-uploader";
import _ from "lodash";

export interface ISavedCard {
  title: string;
  value: {
    cardSchema: any;
    cardData: any;
  };
}

export interface ISiteEl {
  title: string;
  elements: any;
}

interface IAppState {
  selectedSiteFileElements: any;
  savedCards?: Array<ISavedCard>;
  siteFile?: string | object;
  siteFileElements?: Array<ISiteEl>;
  showroomCard?: ISavedCard;
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

class App extends React.Component<{}, IAppState> {
  private fileReader: any;

  constructor(props: any) {
    super(props);

    let savedCards: Array<ISavedCard> | undefined = getFromLoaclStorage(
      "savedCards"
    );

    if (!savedCards) {
      savedCards = [];
    }

    savedCards.push({
      title: "Select From Saved",
      value: {
        cardData: "",
        cardSchema: "",
      },
    });

    let siteFile: any = getFromLoaclStorage("siteFile");
    let siteFileElements: Array<ISiteEl> = [
      { title: "Select From Site File", elements: "" },
    ];

    if (!!siteFile) {
      let allLists = parseSiteFileData(siteFile.Lists);
      _.map(Object.keys(allLists), (key) => {
        siteFileElements.push({
          title: key,
          elements: allLists[key],
        });
      });
    }

    this.state = {
      savedCards: savedCards,
      siteFile: siteFile,
      siteFileElements: siteFileElements,
      selectedSiteFileElements: [],
      showroomCard: undefined,
      currentEditingCard: {
        cardSchema: {
          title: undefined,
          type: "AdaptiveCard",
          version: "1.0",
          body: [],
        },
        cardData: {},
      },
    };
  }

  private updateSiteFile = () => {
    let siteFile: any = getFromLoaclStorage("siteFile");
    let siteFileElements: any[] = [
      { title: "Select From Site File", elements: "" },
    ];

    if (!!siteFile) {
      let allLists = parseSiteFileData(siteFile.Lists);
      _.map(Object.keys(allLists), (key) => {
        siteFileElements.push({
          title: key,
          elements: allLists[key],
        });
      });
      this.updateLocalState("siteFileElements", siteFileElements);
    }
  };

  private updateLocalState = (key: string, value: any) => {
    this.setState((prevState: IAppState) => {
      return {
        ...prevState,
        [key]: value,
      };
    });
  };

  private addSiteFile = (
    successFiles: IFileWithMeta[],
    allFiles: IFileWithMeta[]
  ) => {
    this.fileReader = new FileReader();
    this.fileReader.onload = (event: any) => {
      this.setState({ siteFile: JSON.parse(event.target.result) });
      window.localStorage.setItem("siteFile", event.target.result);
      this.updateSiteFile();
    };

    this.fileReader.readAsText(successFiles[0].file);
  };

  render() {
    return (
      <div className="App">
        <Router>
          <Nav
            ariaLabel="Nav basic example"
            onRenderLink={(link: any) => {
              return (
                <Link className="link" to={`${link.url}`}>
                  {link.name}
                </Link>
              );
            }}
            groups={[
              {
                links: [
                  {
                    name: "Documentation",
                    url: "/",
                    key: "key1",
                  },
                  {
                    name: "Card Designer",
                    url: "/designer",
                    key: "key2",
                  },
                ],
              },
            ]}
          />
          <div className="container">
            <Switch>
              <Route exact path="/">
                <Doc
                  changeSiteFile={this.addSiteFile}
                  hasSiteFile={!!this.state.siteFile}
                ></Doc>
              </Route>
              <Route path="/designer/viewCard">
                <ShowRoom card={this.state.showroomCard} />
              </Route>
              <Route path="/designer">
                {(props: any) => (
                  <AdaptiveCardDesigner
                    updateLocalState={this.updateLocalState}
                    sitefile={this.state.siteFile}
                    history={props.history}
                    {...this.state}
                  />
                )}
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
