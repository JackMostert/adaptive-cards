import * as React from "react";
import * as ACFabric from "adaptivecards-fabric";
import * as ACTemplating from "adaptivecards-templating";
import * as AdaptiveCards from "adaptivecards";

import "adaptivecards-designer/dist/adaptivecards-defaulthost.css";
import "adaptivecards-designer/dist/adaptivecards-designer.css";
import { ISavedCard } from "./App";
import _ from "lodash";
import { isNumber } from "util";

interface IShowRoomProps {
  card?: ISavedCard;
}

class ShowRoom extends React.Component<IShowRoomProps, any> {
  state = {
    theme: "microsoft-teams-light.json",
  };

  componentDidMount() {
    // ACFabric.useFabricComponents();
    if (!this.props.card) return;

    const Card = this.props.card.value.cardSchema;
    const CardData = this.props.card.value.cardData;

    _.map(CardData, (ele, key) => {
      if (isNumber(ele)) {
        CardData[key] = ele + "";
      }
    });

    let adaptiveCard = new AdaptiveCards.AdaptiveCard();

    adaptiveCard.hostConfig = new AdaptiveCards.HostConfig(
      require(`./HostConfig/microsoft-teams-light.json`)
    );

    let template = new ACTemplating.Template(Card);
    let dataContext = new ACTemplating.EvaluationContext();
    dataContext.$root = CardData;
    const card = template.expand(dataContext);

    adaptiveCard.parse(card);

    const renderedCard = adaptiveCard.render();

    const div = document.getElementById("exampleDiv");
    if (div) {
      div.appendChild(renderedCard);
    }
  }

  render() {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "500px 1fr",
          paddingTop: 100,
          height: "100vh",
          overflow: "auto",
          boxSizing: "border-box",
        }}
      >
        <div id="exampleDiv" className="exampleDiv"></div>
        <div>DEBUG</div>
      </div>
    );
  }
}

export default ShowRoom;
