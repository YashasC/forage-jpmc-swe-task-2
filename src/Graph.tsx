import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

/**
 * Props declaration for <Graph />
 */
interface IProps {
  data: ServerRespond[],
}

/**
 * Perspective library adds load to HTMLElement prototype.
 * This interface acts as a wrapper for TypeScript compiler.
 */
interface PerspectiveViewerElement extends HTMLElement {
  load: (table: Table) => void;
  setAttribute: (name: string, value: string) => void;
}

/**
 * React component that renders Perspective based on data
 * parsed from its parent through data property.
 */
class Graph extends Component<IProps, {}> {
  // Perspective table
  table: Table | undefined;

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as unknown as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');
      elem.setAttribute('column-pivots', '["stock"]');
      elem.setAttribute('row-pivots', '["timestamp"]');
      elem.setAttribute('columns', '["top_ask_price"]');
      elem.setAttribute('aggregates', '{"stock": "distinct count", "top_ask_price": "avg", "top_bid_price": "avg", "timestamp": "distinct count"}');
    }
  }

  componentDidUpdate() {
    if (this.table) {
      this.table.update(this.props.data.map((el: any) => {
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }

  render() {
    return (
      <perspective-viewer
        view="y_line"
        column-pivots='["stock"]'
        row-pivots='["timestamp"]'
        columns='["top_ask_price"]'
        aggregates='{"stock": "distinct count", "top_ask_price": "avg", "top_bid_price": "avg", "timestamp": "distinct count"}'>
      </perspective-viewer>
    );
  }
}

export default Graph;
