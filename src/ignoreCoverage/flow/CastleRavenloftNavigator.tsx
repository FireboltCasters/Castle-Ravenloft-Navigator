import React, {useState, useRef, Component, FunctionComponent, useEffect} from 'react';
import ReactFlow, {
    addEdge,
//    removeElements,
    Controls, isNode,
    Background,
    getOutgoers, isEdge, useEdgesState, useNodesState, ReactFlowProvider, ReactFlowInstance, getBezierPath
} from 'react-flow-renderer';
import { Toast } from 'primereact/toast';
import {MyToolbar} from "./MyToolbar";
import {MyGraph} from "./../../api/src/";

import { Dropdown } from 'primereact/dropdown';
import {Button} from "primereact/button";

const edgeNormal = "#444444";
const edgeCritical = "#ff2222";

export const CastleRavenloftNavigator : FunctionComponent = (props) => {

    function parseQueryString() {
        let query = window.location.search.substring(1);
        let pairs = query.split("&");
        let result = {};
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i].split("=");
            // @ts-ignore
            result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || "");
        }
        return result;
    }

    const queryParameters = parseQueryString();

    console.log("queryParameters")
    console.log(JSON.parse(JSON.stringify(queryParameters)));

    const toast = useRef(null);

    const [reloadNumber, setReloadNumber] = useState(0);

    const [startRoom, setStartRoom] = useState("K1");
    const [endRoom, setEndRoom] = useState("K9");
    const initialShortestPath: string[] = [];
    const [shortestPath, setShortestPath] = useState(initialShortestPath);
    const [searchParams, setSearchParams] = useState(JSON.parse(JSON.stringify(queryParameters)));

    let graph = new MyGraph();

    function mySetSearchParams(newSearchParams: any){
        console.log("mySetSearchParams")
        console.log(newSearchParams);
        console.log(searchParams)
        let newSearchParamsKeys = Object.keys(newSearchParams);
        let queryString = "";
        for(let i = 0; i < newSearchParamsKeys.length; i++){
            let key = newSearchParamsKeys[i];
            let value = newSearchParams[key];
            if(!!value){
                queryString += key + "=" + value;
                if(i < newSearchParamsKeys.length - 1){
                    queryString += "&";
                }
            }
        }

        if(JSON.stringify(newSearchParams) !== JSON.stringify(searchParams)){
            console.log("mySetSearchParams: changed")
            setSearchParams(newSearchParams);
            console.log(newSearchParams)
//        window.location.search = +"?"+searchParams.toString();
            window.history.pushState(null, "", "?"+queryString);
        } else {
            console.log("mySetSearchParams: not changed")
        }
    }

    useEffect(() => {
        document.title = "Castle-Ravenloft-Navigator";
    }, [])

    function renderPlan(){
        return (
            <div style={{backgroundColor: "white", flex: 1}} key={"renderedPLan"}>
                <div style={{marginLeft: 20}}><h2>{"Castle-Ravenloft-Navigator"}</h2></div>
            </div>
        )
    }

    function renderInputs(){
        let roomSelectItems = [];
        let roomIds = graph.getRooms();
        for(let i = 0; i < roomIds.length; i++){
            roomSelectItems.push({label: roomIds[i], value: roomIds[i]});
        }

        return(
            <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                <Dropdown optionLabel="label" value={startRoom} options={roomSelectItems} onChange={(e) => {
                    setStartRoom(e.value)
                    setShortestPath([])
                }} placeholder="Start Room"/>
                <div style={{height: "10px"}}></div>
                <Dropdown optionLabel="label" value={endRoom} options={roomSelectItems} onChange={(e) => {
                    setEndRoom(e.value)
                    setShortestPath([])
                }} placeholder="Destination Room"/>
                <div style={{height: "10px"}}></div>
                <Button disabled={!startRoom || !endRoom} label={"Navigate"} icon="pi pi-arrows-h" className="p-button-warning" style={{margin: 5}} onClick={() => {
                    let graphConfigured = new MyGraph();

                    let searchParamKeys = Object.keys(searchParams);
                    for(let i = 0; i < searchParamKeys.length; i++){
                        let key = searchParamKeys[i];
                        if(key.startsWith("sd:")){
                            let secretDoorKey = key.substring("sd:".length);
                            graphConfigured.activateSecretDoor(secretDoorKey);
                        }
                    }

                    let calculatedShortestPath = graphConfigured.getShortestPath(startRoom, endRoom);
                    setShortestPath(calculatedShortestPath);
                }} />
            </div>
        )
    }

    function renderShortestPath(){
        let renderedShortestPath = [];
        for(let i = 0; i < shortestPath.length; i++){
            let room = shortestPath[i];
            let mapColor = graph.getMapColorOfRoom(room);

            renderedShortestPath.push(
                <div style={{padding: "10px", backgroundColor: mapColor, borderRadius: "10px"}}>
                    <div style={{backgroundColor: "white"}}>
                        <h3 key={i}>{room}</h3>
                    </div>
                </div>
            )
            if(i < shortestPath.length - 1){
                renderedShortestPath.push(<h3 key={i + "arrow"} style={{paddingLeft: "5px", paddingRight: "5px"}}>{" -> "}</h3>)
            }
        }

        return(
            <>
                <div style={{marginLeft: 20}}><h2>{"Shortest Path"}</h2></div>
                <div style={{display: "flex", flexDirection: "row", flex: 1, justifyContent: "center", flexWrap: "wrap"}}>
                    {renderedShortestPath}
                </div>
            </>
        )
    }

    return (
            <ReactFlowProvider >
                <Toast ref={toast}></Toast>
                <div style={{width: "100%", height: "100vh"}}>
                        <div style={{display: "flex", flexDirection: "row", height: "100%"}}>
                            <div style={{display: "flex", flex: 3, backgroundColor: "white"}}>
                                <div style={{backgroundColor: "white", flex: 1}} key={"renderedPLan"}>
                                    <div style={{marginLeft: 20}}><h2>{"Castle-Ravenloft-Navigator"}</h2></div>
                                    {renderInputs()}
                                    {renderShortestPath()}
                                </div>
                            </div>
                            <div style={{display: "flex", flex: 1, flexDirection: "column", backgroundColor: "#EEEEEE"}}>
                                <MyToolbar searchParams={JSON.parse(JSON.stringify(searchParams))} setSearchParams={mySetSearchParams} setReloadNumber={setReloadNumber} reloadNumber={reloadNumber} />
                            </div>
                        </div>
                </div>
            </ReactFlowProvider>
        );
}
