import React, {ReactNode, useState} from 'react';
import {FunctionComponent} from "react";
import {Button} from "primereact/button";
import { Checkbox } from 'primereact/checkbox';
import {MyGraph} from "../../api/src";
import 'primeicons/primeicons.css';

export interface AppState{
    setReloadNumber?: any,
    reloadNumber?: any
    searchParams?: any,
    setSearchParams?: any
}
export const MyToolbar: FunctionComponent<AppState> = ({searchParams, setSearchParams, setReloadNumber, reloadNumber, ...props}) => {

    const [showDMTools, setShowDMTools] = useState(false);

    function renderSpitLine(){
        return (
            <div style={{width: "100%", height: 2, backgroundColor: "gray", marginTop: 10, marginBottom: 10}}></div>
        )
    }

    function renderSwitchButton(){
        let label = showDMTools ? "Hide DM Tools" : "Show DM Tools";
        let icon = showDMTools ? "pi pi-eye-dem" : "pi pi-eye";

        return (
            <Button label={label} icon={icon} className="p-button-warning" style={{margin: 5}} onClick={() => {
                setShowDMTools(!showDMTools);
            }} />
        )
    }

    function getSecretDoorKeyForSearchParamSecretString(secretDoorKey: string){
        let secretPreString = "sd:";
        let searchParamSecretString = secretPreString + secretDoorKey;
        return searchParamSecretString;
    }

    function isSecretDoorActive(secretDoorKey: string){
        let searchParamSecretString = getSecretDoorKeyForSearchParamSecretString(secretDoorKey);
        let rawValue = searchParams?.[searchParamSecretString] || false;
        let checked = rawValue === "true" || rawValue === true;
        return checked;
    }

    function renderSecretDoorSettingAll(secretDoorsKeys: string[]){
        let allSecretDoorsActive = true;
        for(let i = 0; i < secretDoorsKeys.length; i++){
            let secretDoorKey = secretDoorsKeys[i];
            if(!isSecretDoorActive(secretDoorKey)){
                allSecretDoorsActive = false;
                break;
            }
        }
        let label = allSecretDoorsActive ? "Deactivate all Secret Doors" : "Activate all Secret Doors";

        return(
            <div className="col-12">
                <Checkbox onChange={e => {
                    for(let i = 0; i < secretDoorsKeys.length; i++){
                        let secretDoorKey = secretDoorsKeys[i];
                        let searchParamSecretString = getSecretDoorKeyForSearchParamSecretString(secretDoorKey);
                        searchParams[searchParamSecretString] = e.checked;
                        if(!e.checked){
                            delete searchParams[searchParamSecretString];
                        }
                        setSearchParams(searchParams);
                    }
                }} checked={allSecretDoorsActive}></Checkbox>
                <label htmlFor="cb1" className="p-checkbox-label">{label}</label>
            </div>
        )
    }

    function renderSecretDoorSetting(secretDoorKey: string){
        let searchParamSecretString = getSecretDoorKeyForSearchParamSecretString(secretDoorKey);
        let checked = isSecretDoorActive(secretDoorKey);

        return(
            <div className="col-12">
                <Checkbox onChange={e => {
                    searchParams[searchParamSecretString] = e.checked;
                    if(!e.checked){
                        delete searchParams[searchParamSecretString];
                    }
                    setSearchParams(searchParams);
                }} checked={checked}></Checkbox>
                <label htmlFor="cb1" className="p-checkbox-label">{secretDoorKey}</label>
            </div>
        )
    }

    function renderSecretDoorSettings(){
        let graph = new MyGraph();
        let secretDoors = graph.getSecretDoors();
        let secretDoorsKeys = Object.keys(secretDoors);
        let renderedSecretDoors: ReactNode[] = [];
        for(let i = 0; i < secretDoorsKeys.length; i++){
            let secretDoorKey = secretDoorsKeys[i];
            renderedSecretDoors.push(renderSecretDoorSetting(secretDoorKey));
        }
        return (
            <div style={{flexDirection: "row"}}>
                <h2>{"Secret Doors found:"}</h2>
                <div>{"For example: K13-2N means the Room K13 2nd floor north side"}</div>
                <div style={{height: "20px"}}></div>
                {renderSecretDoorSettingAll(secretDoorsKeys)}
                {renderSpitLine()}
                {renderedSecretDoors}
            </div>
        );
    }

    function renderDMTools(){
        if(!showDMTools){
            return null;
        }

        return (
            <div style={{flexDirection: "column", display: "flex", flex: 1, backgroundColor: "#EEEEEE", paddingLeft: 10,paddingTop: 20, paddingRight: 10}}>
                {renderSpitLine()}
                <div>{"- After configuration you can share this link to your players. The DM Tools are hidden by default."}</div>
                {renderSpitLine()}
                <div>{"- Currently the Elevator is not included in this tool."}</div>
                <div>{"- We assume, that windows could be broken/opened"}</div>
                {renderSecretDoorSettings()}
            </div>
        )
    }

    function renderBadge(content: any){
        return(
            <div style={{marginRight: "3px",display: "inline-block"}}>
                {content}
            </div>
        )
    }

    function render(){
        let gitHubLink = "https://github.com/FireboltCasters/Castle-Ravenloft-Navigator";


        const leftContents = (
            <div style={{width: "100%", flexGrow: 1, flexDirection: "column", display: "flex", flex: 1, backgroundColor: "#EEEEEE", paddingLeft: 10,paddingTop: 20, paddingRight: 10}}>
                <div>
                    {renderSwitchButton()}
                </div>

                {renderDMTools()}

                {renderSpitLine()}
                <div>
                    <a href={gitHubLink} target="_blank" style={{display: "inline-block"}} >
                        <Button label="GitHub Project" icon={"pi pi-github"} />
                    </a>
                    <div style={{height: "20px"}}></div>
                    <div style={{flexDirection: "row", width: "100%"}}>
                        {renderBadge(<a href="https://github.com/FireboltCasters/Castle-Ravenloft-Navigator"><img src="https://visitor-badge.glitch.me/badge?page_id=FireboltCasters/Castle-Ravenloft-Navigator.visitor-badge" alt="npm package" /></a>)}
                        {renderBadge(<a href="https://github.com/FireboltCasters/Castle-Ravenloft-Navigator"><img src="https://badge.fury.io/js/castle-ravenloft-navigator.svg" alt="npm package" /></a>)}
                        {renderBadge(<a href="https://github.com/FireboltCasters/Castle-Ravenloft-Navigator"><img src="https://img.shields.io/github/last-commit/FireboltCasters/Castle-Ravenloft-Navigator?logo=git" alt="last commit" /></a>)}
                        {renderBadge(<a href="https://github.com/FireboltCasters/Castle-Ravenloft-Navigator"><img src="https://img.shields.io/npm/dt/castle-ravenloft-navigator.svg" alt="downloads total" /></a>)}
                    </div>
                </div>

                <h2>{"Contributors"}</h2>
                <div>{"The FireboltCasters"}</div>
                <p dir="auto"><a href="https://github.com/FireboltCasters/Castle-Ravenloft-Navigator"><img src="https://camo.githubusercontent.com/8f083ac83a6be334c8ae510c7e0e62fa409986aac460bf8b923c629e34266b7b/68747470733a2f2f636f6e747269622e726f636b732f696d6167653f7265706f3d46697265626f6c74436173746572732f436173746c652d526176656e6c6f66742d4e6176696761746f72" alt="Contributors" data-canonical-src="https://contrib.rocks/image?repo=FireboltCasters/Castle-Ravenloft-Navigator" style={{maxWidth: "100%"}} /></a></p>

                {renderSpitLine()}
                <div>{"This tool is not affiliated with Wizards of the Coast."}</div>
                <div>{"Is is a fan project to support players and dungeon masters."}</div>
            </div>
        );

        const iconCalcAuto = "pi pi-sync"
        const iconCalcManual = "pi pi-refresh"

        return leftContents
    }

    return render();
}
