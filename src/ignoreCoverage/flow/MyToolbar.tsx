import React, {ReactNode, useState} from 'react';
import {FunctionComponent} from "react";
import {Button} from "primereact/button";

export interface AppState{
    setReloadNumber?: any,
    reloadNumber?: any
}
export const MyToolbar: FunctionComponent<AppState> = ({setReloadNumber, reloadNumber, ...props}) => {

    function renderSpitLine(){
        return (
            <div style={{width: "100%", height: 2, backgroundColor: "gray", marginTop: 10, marginBottom: 10}}></div>
        )
    }

    function renderSwitchButton(){
        let disabled = false;
        let label = disabled ? "Switch (select 2)" : "Switch selection";

        return (
            <Button disabled={disabled} label={label} icon="pi pi-arrows-h" className="p-button-warning" style={{margin: 5}} onClick={() => {

            }} />
        )
    }

    function render(){
        const leftContents = (
            <div style={{width: "100%", flexGrow: 1, flexDirection: "column", display: "flex", flex: 1, backgroundColor: "#EEEEEE", paddingLeft: 10,paddingTop: 20, paddingRight: 10}}>
                <div>
                    {renderSwitchButton()}
                </div>

                {renderSpitLine()}
            </div>
        );

        const iconCalcAuto = "pi pi-sync"
        const iconCalcManual = "pi pi-refresh"

        return leftContents
    }

    return render();
  }
