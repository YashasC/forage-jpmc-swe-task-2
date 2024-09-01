import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
  showGraph: boolean;
  intervalId?: NodeJS.Timeout; // Added
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
      showGraph: false,
    };
  }

  /**
   * Render Graph react component with state.data parsed as property data
   */
  renderGraph() {
    if (this.state.showGraph) {
      return (<Graph data={this.state.data} />);
    }
    return null;  // Render nothing if showGraph is false
  }

  /**
   * Get new data from server and update the state with the new data
   */
  getDataFromServer() {
    // Set an interval to keep fetching data every 100ms
    const intervalId = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Remove duplicate data
        const uniqueData = serverResponds.filter((newData) =>
          !this.state.data.some((existingData) =>
            existingData.timestamp === newData.timestamp && existingData.stock === newData.stock
          )
        );

        // Update the state with the new data
        this.setState((prevState) => ({
          data: [...prevState.data, ...uniqueData]
        }));
      });
    }, 100);

    // Store the interval ID in the state so it can be cleared later
    this.setState({ intervalId });
  }

  /**
   * Render the App react component
   */
  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is clicked, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {
              this.setState({ showGraph: true });
              this.getDataFromServer();
            }}
          >
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
