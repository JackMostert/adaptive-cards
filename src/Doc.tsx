import * as React from "react";
import { Text } from "office-ui-fabric-react";
import "react-dropzone-uploader/dist/styles.css";
import Dropzone, { IFileWithMeta } from "react-dropzone-uploader";

interface IDocProps {
  changeSiteFile: (
    successFiles: IFileWithMeta[],
    allFiles: IFileWithMeta[]
  ) => void;
  hasSiteFile: boolean;
}

let tm = true;

const Doc: React.FunctionComponent<IDocProps> = (props) => {
  return (
    <div className="roc-root">
      <div className="left">
        <Text variant="xxLargePlus">Adaptive Card Designer Documentation</Text>
        <Text variant="xLarge" style={{ color: "grey" }}>
          Read more on <a href="https://adaptivecards.io/">Adaptivecards.io</a>
        </Text>
        <Text variant="large" style={{ marginTop: 50, marginBottom: 30 }}>
          Inoder to install Microsoft Adaptive Card Designer and use it to it's
          full potential. There are a few Libraries that will need to be
          installed, and also configured inside of webpack. The Libraries to
          install are as follows:
        </Text>
        <Text variant="xLarge" style={{ color: "grey" }}>
          Installation
        </Text>
        <Text>
          <pre>
            <code>yarn install adaptivecards</code>
          </pre>
          <pre>
            <code>yarn install adaptivecards-controls</code>
          </pre>
          <pre>
            <code>yarn install adaptivecards-designer</code>
          </pre>
          <pre>
            <code>yarn install css-loader (or similar)</code>
          </pre>
          <pre>
            <code>yarn install markdown-it</code>
          </pre>
          <pre>
            <code>yarn install monaco-editor</code>
          </pre>
          <pre>
            <code>yarn install monaco-editor-webpack-plugin</code>
          </pre>
          <pre>
            <code>yarn install office-ui-fabric-react</code>
          </pre>
          <pre>
            <code>yarn install adaptivecards-templating</code>
          </pre>
        </Text>
        <Text variant="xLarge" style={{ color: "grey", marginTop: 50 }}>
          Configuring Webpack
        </Text>
        <Text variant="large" style={{ marginTop: 20, marginBottom: 10 }}>
          Due to the code editor that gets used inside of the Adaptive Card
          Designer SDK, we need to configure webpack inorder to make full use of
          it. This code editor is the editor which makes it so the user can edit
          the JSON schema for the current Adaptive Card that they are working on
          in realtime. Go into your webpack.config.js or similar. Once inside
          you need to copy and past the following:
        </Text>
        <Text variant="large" style={{ marginTop: 20, marginBottom: 10 }}>
          If you don't want the user to be able to edit from the provided JSON
          editor, then simply skip this step as it's not required.
        </Text>
        <br></br>
        <Text variant="large" style={{ marginTop: 0, marginBottom: 0 }}>
          <pre>
            <code>
              const MonacoWebpackPlugin =
              require("monaco-editor-webpack-plugin");
            </code>
          </pre>
        </Text>
        <br></br>
        <Text variant="large">
          Once added to your webpack config file, you need to scroll down and
          find (or add) the following.
          <br></br>
          <br></br>
          <pre>
            <code>plugins: [ new MonacoWebpackPlugin(),]</code>
          </pre>
          <pre>
            <code>
              module:{" "}
              {`{
                (Optional)
            {
                test: /\\.css$/,
                use: ["style-loader", "css-loader"],
            },

                (Required)
            {
                test: /\\.ttf$/,
                use: ["file-loader"],
            },
}`}
            </code>
          </pre>
        </Text>
      </div>
      <div className="right">
        <Text variant="xxLargePlus">ACD Reasearch and development</Text>
        <Text variant="xLarge" style={{ color: "grey" }}>
          Microsoft Adaptive Card Desginer
        </Text>
        <Text variant="large" style={{ marginTop: 50, marginBottom: 30 }}>
          To get started, Upload your copy of the JSON format site-file. You can
          get this by pressing F12 while inside the Rapidplatform website,
          Clicking on Network, and Clicking on the item that has your site name
          on it.
        </Text>
        {props.hasSiteFile && tm && (
          <Text
            variant="mediumPlus"
            style={{
              color: "green",
              marginBottom: 10,
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            Site file avaliable
          </Text>
        )}
        {tm && (
          <Dropzone
            onSubmit={(
              successFiles: IFileWithMeta[],
              allFiles: IFileWithMeta[]
            ) => {
              tm = false;
              props.changeSiteFile(successFiles, allFiles);
            }}
            accept=".json"
          />
        )}
        {!tm && <Text variant="xxLarge">Site file Uploaded!</Text>}
        <Text
          variant="large"
          style={{ marginTop: 50, marginBottom: 30, textAlign: "left" }}
        >
          The following actions are avaliable:
          <hr />
          <br></br>
          <span style={{ textAlign: "left" }}>
            Save Card - You can save the currently editing card and view it
            later, please not a refresh is required once saved
          </span>
          <br></br>
          <br></br>
          <span style={{ textAlign: "left" }}>
            View Cards from site file - Once a site file is provided you'll be
            able to see all the fields on the side nav, after you've selected an
            entity from the drop down menu.
          </span>
          <br></br>
          <br></br>
          <span style={{ textAlign: "left" }}>
            View Cards you make - You can also preview the cards you make by
            clicking on the view card button in the top menu bar
          </span>
          <br></br>
          <br></br>
          <hr />
        </Text>
      </div>
    </div>
  );
};

export default Doc;
