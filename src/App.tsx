import React, {useState} from 'react';

import "primereact/resources/themes/lara-light-indigo/theme.css";  //theme
import "primereact/resources/primereact.min.css";                  //core css
import {CastleRavenloftNavigator} from "./ignoreCoverage/flow/CastleRavenloftNavigator";

export default class App extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
  }

  render(){
    return (
        <CastleRavenloftNavigator />
    );
  }
}
