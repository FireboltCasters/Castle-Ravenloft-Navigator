// import dijkstrajs from "dijkstrajs";
// @ts-ignore
import dijkstrajs from "dijkstrajs";

class MyRavenloftGraph {

    private graph: any;
    private secretDoors: any;
    private roomInformations: any;
    private mapColors = {
        "12": "#525252",
        "11": "#C9C9C9",
        "3": "#F2F2F2",
        "4": "#75140C",
        "5": "#F9DA78",
        "6": "#DCE3F1",
        "7": "#DCE3F1",
        "8": "#DCE3F1",
        "9": "#DCE3F1",
    }

    constructor() {
        this.graph = {}
        this.secretDoors = {};
        this.roomInformations = {};
    }

    getGraph() {
        return this.graph;
    }

    getSecretDoors() {
        return this.secretDoors;
    }

    getMapColorOfRoom(room: string){
        let roomInformation = this.roomInformations[room];
        let map = roomInformation?.map;
        // @ts-ignore
        return this.mapColors?.[map];
    }

    setSecretDoorsFound(secretDoorId: any) {
        let secretDoors = this.secretDoors[secretDoorId];
        if(secretDoors){
            secretDoors.forEach((secretDoor: any) => {
                this.graph[secretDoor.node1][secretDoor.node2] = secretDoor.weight;
            });
        }
    }

    getRooms(): string[] {
        return Object.keys(this.graph);
    }

    addRoomsToMap(rooms: string[], map: string) {
        rooms.forEach(room => {
            this.addMapToRoom(room, map)
        });
    }

    addMapToRoom(room: string, map: string) {
        if(!this.roomInformations[room]){
            this.roomInformations[room] = {};
        }
        this.roomInformations[room]["map"] = map;
    }

    addNode(node: string) {
        this.graph[node] = {}
    }

    doesNodeExist(node: string) {
        return this.graph[node] !== undefined;
    }

    addOneWayEdge(node1: string, node2: string, weight: number) {
        if(!this.doesNodeExist(node1)) {
            this.addNode(node1);
        }
        this.graph[node1][node2] = weight;
    }

    addOneWaySecretDoor(node1: string, node2: string, weight: number, id: string) {
        let registeredNodes = this.secretDoors[id] || [];
        registeredNodes.push(
            {
                node1: node1,
                node2: node2,
                weight: weight
            }
        );
        this.secretDoors[id] = registeredNodes;
    }

    addOneWayStair(node1: string, node2: string, weight: number) {
        //TODO: add stairs
        this.addOneWayEdge(node1, node2, weight);
    }

    addOneWayElevator(node1: string, node2: string, weight: number) {
        //TODO: add stairs
        //this.addOneWayEdge(node1, node2, weight);
    }

    addOneWayWindow(node1: string, node2: string, weight: number) {
        this.addOneWayEdge(node1, node2, weight);
    }

}

function getMyRavenloftGraph() {

    const myRavenloftGraph = new MyRavenloftGraph();

    const MAP_12_to_Map_11 = 15;
    const MAP_11_to_Map_3 = 12;
    const MAP_3_to_Map_4 = 15;
    const MAP_4_to_Map_5 = 12;
    const MAP_5_to_Map_6 = 12;
    const MAP_6_to_Map_7 = 12;
    const MAP_7_to_Map_8 = 8;
    const MAP_8_to_Map_9 = 15;
    const MAP_9_to_Map_10 = 18;

    myRavenloftGraph.addOneWayEdge("K1", "K7", 1);

    myRavenloftGraph.addOneWayEdge("K3", "K24", 1);
    myRavenloftGraph.addOneWayEdge("K3", "K6", 1);

    myRavenloftGraph.addOneWayEdge("K6", "K3", 1);
    myRavenloftGraph.addOneWayEdge("K6", "K88", MAP_11_to_Map_3+MAP_12_to_Map_11);

    myRavenloftGraph.addOneWayEdge("K7", "K1", 1);
    myRavenloftGraph.addOneWayEdge("K7", "K8", 1);

    myRavenloftGraph.addOneWayEdge("K8", "K7", 1);
    myRavenloftGraph.addOneWayEdge("K8", "K9", 1);
    myRavenloftGraph.addOneWayEdge("K8", "K14", 1);
    myRavenloftGraph.addOneWayEdge("K8", "K19", 1);

    myRavenloftGraph.addOneWayEdge("K9", "K8", 1);
    myRavenloftGraph.addOneWayEdge("K9", "K10", 1);
    myRavenloftGraph.addOneWayEdge("K9", "K21-F1", 1);

    myRavenloftGraph.addOneWayEdge("K10", "K9", 1);
    myRavenloftGraph.addOneWaySecretDoor("K10", "K11", 1, "Dining_Hall_(K10-K11)");

    myRavenloftGraph.addOneWaySecretDoor("K11", "K10", 1, "Dining_Hall_(K10-K11)");
    myRavenloftGraph.addOneWayEdge("K11", "K13-1S", 1);

// South K12 Ground floor
    myRavenloftGraph.addOneWayEdge("K12-1S", "K13-1S", 1);
// North K12 Ground floor
    myRavenloftGraph.addOneWayEdge("K12-1N", "K13-1N", 1);
// South K12 2nd floor
    myRavenloftGraph.addOneWayEdge("K12-2S", "K13-2S", 1);
// North K12 2nd floor
    myRavenloftGraph.addOneWayEdge("K12-2N", "K13-2N", 1);

// South K13 Ground floor
    myRavenloftGraph.addOneWayEdge("K13-1S", "K11", 1);
    myRavenloftGraph.addOneWayEdge("K13-1S", "K12-1S", 1);
    myRavenloftGraph.addOneWayEdge("K13-1S", "K64-F1", 1);
// South K13 2nd floor
    myRavenloftGraph.addOneWayEdge("K13-2S", "K12-2S", 1);
    myRavenloftGraph.addOneWayEdge("K13-2S", "K22-2S", 1);
    myRavenloftGraph.addOneWaySecretDoor("K13-2S", "K25", 1, "Audience_Hall_(K13-2S-K25)");
    myRavenloftGraph.addOneWayEdge("K13-2S", "K64-F2", 1);

// North K13 Ground floor
    myRavenloftGraph.addOneWayEdge("K13-1N", "K12-1S", 1);
    myRavenloftGraph.addOneWayEdge("K13-1N", "K22-1N", 1);
    myRavenloftGraph.addOneWayEdge("K13-1N", "K20-F2", 1);
// North K13 2nd floor
    myRavenloftGraph.addOneWayEdge("K13-2N", "K12-2N", 1);
    myRavenloftGraph.addOneWayEdge("K13-2N", "K22-2N", 1);
    myRavenloftGraph.addOneWaySecretDoor("K13-2N", "K33", 1, "Kings_Apartment_(K13-2N-K33)");

    myRavenloftGraph.addOneWayEdge("K14", "K8", 1);
    myRavenloftGraph.addOneWayEdge("K14", "K15", 1);

    myRavenloftGraph.addOneWayEdge("K15", "K14", 1);
    myRavenloftGraph.addOneWayEdge("K15", "K16", 1);
    myRavenloftGraph.addOneWayEdge("K15", "K17", 1);

    myRavenloftGraph.addOneWayEdge("K16", "K15", 1);
    myRavenloftGraph.addOneWayEdge("K16", "K29", MAP_3_to_Map_4);

    myRavenloftGraph.addOneWayEdge("K17", "K15", 1);
    myRavenloftGraph.addOneWayEdge("K17", "K18-F1", 1);

    myRavenloftGraph.addOneWayEdge("K18-F1", "K17", 1);
    myRavenloftGraph.addOneWayEdge("K18-F4", "K59", 1);
    myRavenloftGraph.addOneWaySecretDoor("K18-B1", "K63", 1, "Wine_Cellar_(K18-B1-K63)");
    myRavenloftGraph.addOneWayEdge("K18-B2", "K84", 1);

// K18 High Tower Staircase
    myRavenloftGraph.addOneWayStair("K18-B2", "K18-B1", MAP_12_to_Map_11);
    myRavenloftGraph.addOneWayStair("K18-B1", "K18-B2", MAP_12_to_Map_11);
    myRavenloftGraph.addOneWayStair("K18-B1", "K18-F1", MAP_11_to_Map_3);
    myRavenloftGraph.addOneWayStair("K18-F1", "K18-B1", MAP_11_to_Map_3);
    const K18_F1_F4 = MAP_3_to_Map_4+MAP_4_to_Map_5+MAP_5_to_Map_6+MAP_6_to_Map_7+MAP_7_to_Map_8+MAP_8_to_Map_9+MAP_9_to_Map_10;
    myRavenloftGraph.addOneWayStair("K18-F1", "K18-F4", K18_F1_F4);
    myRavenloftGraph.addOneWayStair("K18-F4", "K18-F1", K18_F1_F4);


    myRavenloftGraph.addOneWayEdge("K19", "K8", 1);
    myRavenloftGraph.addOneWayStair("K19", "K25", MAP_3_to_Map_4);

    myRavenloftGraph.addOneWayEdge("K20-F1", "K20a", 1);
    myRavenloftGraph.addOneWayEdge("K20-F3", "K46", 1);
    myRavenloftGraph.addOneWayEdge("K20-F3", "K45", 1);
    myRavenloftGraph.addOneWayEdge("K20-F4", "K58", 1);
    myRavenloftGraph.addOneWayEdge("K20-F4", "K60", 1);
    myRavenloftGraph.addOneWaySecretDoor("K20-F2", "K34", 1, "Upper_Servant_Floor_(K20-F2-K34)");
    myRavenloftGraph.addOneWayEdge("K20-F2", "K13-1N", 1);

// K20 Heart of Sorrows Staircase
    myRavenloftGraph.addOneWayStair("K20-F1", "K20-F2", MAP_3_to_Map_4);
    myRavenloftGraph.addOneWayStair("K20-F2", "K20-F1", MAP_3_to_Map_4);
    myRavenloftGraph.addOneWayStair("K20-F2", "K20-F3", MAP_4_to_Map_5);
    myRavenloftGraph.addOneWayStair("K20-F3", "K20-F2", MAP_4_to_Map_5);
    myRavenloftGraph.addOneWayStair("K20-F3", "K20-F4", MAP_5_to_Map_6+MAP_6_to_Map_7+MAP_7_to_Map_8);
    myRavenloftGraph.addOneWayStair("K20-F4", "K20-F3", MAP_5_to_Map_6+MAP_6_to_Map_7+MAP_7_to_Map_8);



    myRavenloftGraph.addOneWayEdge("K20a", "K20-F1", 1);
    myRavenloftGraph.addOneWayStair("K20a", "K71", MAP_11_to_Map_3);

    myRavenloftGraph.addOneWayEdge("K21-F1", "K9", 1);
    myRavenloftGraph.addOneWayEdge("K21-F2", "K30", 1);
    myRavenloftGraph.addOneWayEdge("K21-F3", "K35", 1);
    myRavenloftGraph.addOneWayEdge("K21-F4", "K47", 1);
    myRavenloftGraph.addOneWayEdge("K21-B1", "K61", 1);
    myRavenloftGraph.addOneWayEdge("K21-B2", "K73", 1);

// K21 Castle Ravenloft South Tower Staircase
    myRavenloftGraph.addOneWayStair("K21-B2", "K21-B1", MAP_12_to_Map_11);
    myRavenloftGraph.addOneWayStair("K21-B1", "K21-B2", MAP_12_to_Map_11);
    myRavenloftGraph.addOneWayStair("K21-B1", "K21-F1", MAP_11_to_Map_3);
    myRavenloftGraph.addOneWayStair("K21-F1", "K21-B1", MAP_11_to_Map_3);
    myRavenloftGraph.addOneWayStair("K21-F1", "K21-F2", MAP_3_to_Map_4);
    myRavenloftGraph.addOneWayStair("K21-F2", "K21-F1", MAP_3_to_Map_4);
    myRavenloftGraph.addOneWayStair("K21-F2", "K21-F3", MAP_4_to_Map_5);
    myRavenloftGraph.addOneWayStair("K21-F3", "K21-F2", MAP_4_to_Map_5);
    const K21_F3_F4 = MAP_5_to_Map_6;
    myRavenloftGraph.addOneWayStair("K21-F3", "K21-F4", K21_F3_F4);
    myRavenloftGraph.addOneWayStair("K21-F4", "K21-F3", K21_F3_F4);

    myRavenloftGraph.addOneWayEdge("K22-1N", "K13-1N", 1);
    myRavenloftGraph.addOneWayEdge("K22-2N", "K13-2N", 1);
    myRavenloftGraph.addOneWayEdge("K22-2S", "K13-2S", 1);


    myRavenloftGraph.addOneWayEdge("K23", "K24", 1);
    myRavenloftGraph.addOneWayStair("K23", "K62", MAP_11_to_Map_3);

    myRavenloftGraph.addOneWayEdge("K24", "K3", 1);
    myRavenloftGraph.addOneWayEdge("K24", "K23", 1);
    myRavenloftGraph.addOneWayStair("K24", "K34", MAP_3_to_Map_4);

    myRavenloftGraph.addOneWaySecretDoor("K25", "K13-2S", 1, "AudienceHall_(K13-2S-K25)");
    myRavenloftGraph.addOneWayStair("K25", "K19", MAP_3_to_Map_4)
    myRavenloftGraph.addOneWayEdge("K25", "K26", 1);
    myRavenloftGraph.addOneWayEdge("K25", "K30", 1);

    myRavenloftGraph.addOneWayEdge("K26", "K25", 1);
    myRavenloftGraph.addOneWayEdge("K26", "K27", 1);
    myRavenloftGraph.addOneWaySecretDoor("K26", "K33", 1, "Kings_Aprartment_(K26-K33)");

    myRavenloftGraph.addOneWayEdge("K27", "K26", 1);
    myRavenloftGraph.addOneWayEdge("K27", "K28", 1);

    myRavenloftGraph.addOneWayEdge("K28", "K27", 1);
    myRavenloftGraph.addOneWayStair("K28", "K15", MAP_3_to_Map_4);
    myRavenloftGraph.addOneWayEdge("K28", "K29", 1);

    myRavenloftGraph.addOneWayStair("K29", "K16", MAP_3_to_Map_4);
    myRavenloftGraph.addOneWayEdge("K29", "K28", 1);

    myRavenloftGraph.addOneWayEdge("K30", "K25", 1);
    myRavenloftGraph.addOneWayEdge("K30", "K21-F2", 1);

    myRavenloftGraph.addOneWayElevator("K31", "Elevator", 1);

    myRavenloftGraph.addOneWaySecretDoor("K31b", "39", 1, "Hall_of_Webs_(K39-K31b)");
    myRavenloftGraph.addOneWayElevator("K31b", "Elevator", 1);
    myRavenloftGraph.addOneWaySecretDoor("K31b", "47", 1, "Trapworks_to_Portrait_of_Strahd_(31b-K47)");


    myRavenloftGraph.addOneWayEdge("K32", "K33", 1);

    myRavenloftGraph.addOneWayEdge("K33", "K32", 1);
    myRavenloftGraph.addOneWaySecretDoor("K33", "K13-2N", 1, "Kings_Apartment_(K13-2N-K33)");
    myRavenloftGraph.addOneWaySecretDoor("K33", "K26", 1, "Kings_Aprartment_(K26-K33)");
    myRavenloftGraph.addOneWayStair("K33", "K45", MAP_4_to_Map_5);

    myRavenloftGraph.addOneWayStair("K34", "K24", MAP_3_to_Map_4);
    myRavenloftGraph.addOneWaySecretDoor("K34", "K20-F2", 1, "Upper_Servant_Floor_(K20-F2-K34)");

    myRavenloftGraph.addOneWayEdge("K35", "K21-F3", 1);
    myRavenloftGraph.addOneWayEdge("K35", "K36", 1);

    myRavenloftGraph.addOneWayEdge("K36", "K35", 1);
    myRavenloftGraph.addOneWayEdge("K36", "K37", 1);
    myRavenloftGraph.addOneWayEdge("K36", "K43", 1);
    myRavenloftGraph.addOneWayWindow("K36", "K46", 1);

    myRavenloftGraph.addOneWayEdge("K37", "K36", 1);
    myRavenloftGraph.addOneWaySecretDoor("K37", "K38", 1, "Study_to_False_Treasury_(K37-K38)");
    myRavenloftGraph.addOneWayEdge("K37", "K42", 1);
    myRavenloftGraph.addOneWayEdge("K37", "K45", 1);
    myRavenloftGraph.addOneWayEdge("K37", "K83a", 1);


    myRavenloftGraph.addOneWaySecretDoor("K38", "K37", 1, "Study_to_False_Treasury_(K37-K38)");
    myRavenloftGraph.addOneWaySecretDoor("K38", "K39", 1, "False_Treasury_to_Hall_of_Webs_(K38-K39)");

    myRavenloftGraph.addOneWaySecretDoor("K39", "K31b", 1, "Hall_of_Webs_(K39-K31b)");
    myRavenloftGraph.addOneWaySecretDoor("K39", "K38", 1, "False_Treasury_to_Hall_of_Webs_(K38-K39)");
    myRavenloftGraph.addOneWayEdge("K39", "K40", 1);

    myRavenloftGraph.addOneWayEdge("K40", "K39", 1);
    myRavenloftGraph.addOneWaySecretDoor("K40", "K41", 1, "Belfry_to_Treasury_(K40-K41)");

    myRavenloftGraph.addOneWaySecretDoor("K41", "K40", 1, "Belfry_to_Treasury_(K40-K41)");

    myRavenloftGraph.addOneWayEdge("K42", "K37", 1);
    myRavenloftGraph.addOneWayEdge("K42", "K43", 1);
    myRavenloftGraph.addOneWaySecretDoor("K42", "K45", 1, "Kings_Bedchamber_to_Hall_of_Heroes_(K42-K45)");
    myRavenloftGraph.addOneWayWindow("K42", "K46", 1);

    myRavenloftGraph.addOneWayEdge("K43", "K36", 1);
    myRavenloftGraph.addOneWayEdge("K43", "K42", 1);
    myRavenloftGraph.addOneWayEdge("K43", "K44", 1);

    myRavenloftGraph.addOneWayEdge("K44", "K43", 1);
    myRavenloftGraph.addOneWayWindow("K44", "K46", 1);

    myRavenloftGraph.addOneWaySecretDoor("K45", "K42", 1, "Kings_Bedchamber_to_Hall_of_Heroes_(K42-K45)");
    myRavenloftGraph.addOneWayEdge("K45", "K20-F3", 1);
    myRavenloftGraph.addOneWayStair("K45", "K33", MAP_4_to_Map_5);
    myRavenloftGraph.addOneWayEdge("K45", "K46", 1);
    myRavenloftGraph.addOneWayEdge("K45", "K37", 1);


    myRavenloftGraph.addOneWayEdge("K46", "K20-F3", 1);
    myRavenloftGraph.addOneWayWindow("K46", "K36", 1);
    myRavenloftGraph.addOneWayWindow("K46", "K42", 1);
    myRavenloftGraph.addOneWayWindow("K46", "K44", 1);
    myRavenloftGraph.addOneWayEdge("K46", "K45", 1);
    myRavenloftGraph.addOneWayEdge("K46", "K64-F3", 1);

    myRavenloftGraph.addOneWaySecretDoor("K47", "K31b", 1, "Trapworks_to_Portrait_of_Strahd_(31b-K47)");
    myRavenloftGraph.addOneWayEdge("K47", "K49", 1);
    myRavenloftGraph.addOneWayEdge("K47", "K21-F4", 1);
    myRavenloftGraph.addOneWayEdge("K47", "K48-M6", 1);

    myRavenloftGraph.addOneWayEdge("K48-M6", "K47", 1);
    myRavenloftGraph.addOneWayStair("K48-M7", "K54", 1);
    myRavenloftGraph.addOneWayEdge("K48-M8", "K57", 1);

    myRavenloftGraph.addOneWayStair("K48-M6", "K48-M7", MAP_6_to_Map_7);
    myRavenloftGraph.addOneWayStair("K48-M7", "K48-M6", MAP_6_to_Map_7);
    myRavenloftGraph.addOneWayStair("K48-M7", "K48-M8", MAP_7_to_Map_8);
    myRavenloftGraph.addOneWayStair("K48-M8", "K48-M7", MAP_7_to_Map_8);

    myRavenloftGraph.addOneWayEdge("K49", "K47", 1);
    myRavenloftGraph.addOneWayEdge("K49", "K50", 1);

    myRavenloftGraph.addOneWayEdge("K50", "K49", 1);
    myRavenloftGraph.addOneWayEdge("K50", "K51", 1);

    myRavenloftGraph.addOneWayEdge("K51", "K50", 1);
    myRavenloftGraph.addOneWaySecretDoor("K51", "K55", 1, "Closet_to_Element_Room_(K51-K55)");

    myRavenloftGraph.addOneWayEdge("K52", "K53", 1);
    myRavenloftGraph.addOneWayEdge("K52", "K37", 1);

    myRavenloftGraph.addOneWayEdge("K53", "K45", 1);
    myRavenloftGraph.addOneWayEdge("K53", "K46", 1);
    myRavenloftGraph.addOneWayEdge("K53", "K52", 1);

    myRavenloftGraph.addOneWayEdge("K54", "K48-M7", 1);
    myRavenloftGraph.addOneWayEdge("K54", "K55", 1);

    myRavenloftGraph.addOneWaySecretDoor("K55", "K51", 1, "Closet_to_Element_Room_(K51-K55)");
    myRavenloftGraph.addOneWayEdge("K55", "K54", 1);
    myRavenloftGraph.addOneWayEdge("K55", "K56", 1);

    myRavenloftGraph.addOneWayEdge("K56", "K55", 1);

    myRavenloftGraph.addOneWayEdge("K57", "K48-M8", 1);
    myRavenloftGraph.addOneWayEdge("K57", "K58", 1);

    myRavenloftGraph.addOneWayEdge("K58", "K57", 1);
    myRavenloftGraph.addOneWayEdge("K58", "K20-F4", 1);

    myRavenloftGraph.addOneWayEdge("K59", "K18-F4", 1);

    myRavenloftGraph.addOneWayEdge("K60", "K20-F4", 1);
    myRavenloftGraph.addOneWayEdge("K60", "K60a", 1);

    myRavenloftGraph.addOneWayEdge("K60a", "K60", 1);

    myRavenloftGraph.addOneWayEdge("K61", "K21-B1", 1);
    myRavenloftGraph.addOneWayEdge("K61", "K62", 1);
    myRavenloftGraph.addOneWayElevator("K61", "Elevator", 1);

    myRavenloftGraph.addOneWayStair("K62", "K23", MAP_11_to_Map_3);
    myRavenloftGraph.addOneWayEdge("K62", "K61", 1);
    myRavenloftGraph.addOneWayEdge("K62", "K63", 1);
    myRavenloftGraph.addOneWayEdge("K62", "K65", 1);
    myRavenloftGraph.addOneWayEdge("K62", "K66", 1);
    myRavenloftGraph.addOneWayEdge("K62", "K67", 1);

    myRavenloftGraph.addOneWayEdge("K63", "K62", 1);
    myRavenloftGraph.addOneWaySecretDoor("K63", "K18-B1", 1, "Wine_Cellar_(K18-B1-K63)");

    myRavenloftGraph.addOneWayEdge("K64-B1", "K68", 1);
    myRavenloftGraph.addOneWayEdge("K64-F1", "K13-1S", 1);
    myRavenloftGraph.addOneWayEdge("K64-F2", "K13-2S", 1);
    myRavenloftGraph.addOneWayEdge("K64-F3", "K46", 1);

// Guards Stairs
    myRavenloftGraph.addOneWayStair("K64-B1", "K64-F1", MAP_11_to_Map_3);
    myRavenloftGraph.addOneWayStair("K64-F1", "K64-B1", MAP_11_to_Map_3);
    myRavenloftGraph.addOneWayStair("K64-F1", "K64-F2", MAP_3_to_Map_4);
    myRavenloftGraph.addOneWayStair("K64-F2", "K64-F1", MAP_3_to_Map_4);
    myRavenloftGraph.addOneWayStair("K64-F2", "K64-F3", MAP_4_to_Map_5);
    myRavenloftGraph.addOneWayStair("K64-F3", "K64-F2", MAP_4_to_Map_5);


    myRavenloftGraph.addOneWayEdge("K65", "K62", 1);

    myRavenloftGraph.addOneWayEdge("K66", "K62", 1);

    myRavenloftGraph.addOneWayEdge("K67", "K62", 1);
    myRavenloftGraph.addOneWayEdge("K67", "K68", 1);
    myRavenloftGraph.addOneWayEdge("K67", "K70", 1);

    myRavenloftGraph.addOneWayEdge("K68", "K67", 1);
    myRavenloftGraph.addOneWayEdge("K68", "K64-B1", 1);
    myRavenloftGraph.addOneWayEdge("K68", "K69", 1);

    myRavenloftGraph.addOneWayEdge("K69", "K68", 1);

    myRavenloftGraph.addOneWayEdge("K70", "K67", 1);
    myRavenloftGraph.addOneWayEdge("K70", "K71", 1);
    myRavenloftGraph.addOneWayEdge("K70", "K72", 1);

    myRavenloftGraph.addOneWayEdge("K71", "K70", 1);
    myRavenloftGraph.addOneWayStair("K71", "K20a", MAP_11_to_Map_3);

    myRavenloftGraph.addOneWayEdge("K72", "K70", 1);
    myRavenloftGraph.addOneWayStair("K72", "K79", MAP_12_to_Map_11);

    myRavenloftGraph.addOneWayStair("K73", "K21-B3", 1);
    myRavenloftGraph.addOneWayEdge("K73", "K74", 1);
    myRavenloftGraph.addOneWayEdge("K73", "K75", 1);
    myRavenloftGraph.addOneWayEdge("K73", "K76", 1);

    myRavenloftGraph.addOneWayEdge("K74", "K73", 1);

    myRavenloftGraph.addOneWayEdge("K75", "K73", 1);

    myRavenloftGraph.addOneWayEdge("K76", "K73", 1);

    myRavenloftGraph.addOneWayEdge("K77", "K76", 1);
    myRavenloftGraph.addOneWayEdge("K77", "K78", 1);

    myRavenloftGraph.addOneWayEdge("K78", "K77", 1);
    myRavenloftGraph.addOneWayEdge("K78", "K79", 1);
    myRavenloftGraph.addOneWayEdge("K78", "K80", 1);
    myRavenloftGraph.addOneWayEdge("K78", "K83", 1);

    myRavenloftGraph.addOneWayEdge("K79", "K78", 1);
    myRavenloftGraph.addOneWayStair("K79", "K72", MAP_12_to_Map_11);

    myRavenloftGraph.addOneWayEdge("K80", "K78", 1);
    myRavenloftGraph.addOneWayEdge("K80", "K81", 1);

    myRavenloftGraph.addOneWayEdge("K81", "K80", 1);
    myRavenloftGraph.addOneWayEdge("K81", "K84", 1);
    myRavenloftGraph.addOneWaySecretDoor("K81", "K82", 1, "Tunnel_to_North_Dungeon_(K81-K82)");

    myRavenloftGraph.addOneWayEdge("K82", "K74", 1);

// Spiral Staircase
    myRavenloftGraph.addOneWayEdge("K83", "K78", 1);
    const K83_to_83a = MAP_12_to_Map_11+MAP_11_to_Map_3+MAP_3_to_Map_4+MAP_4_to_Map_5;
    myRavenloftGraph.addOneWayStair("K83", "K83a", K83_to_83a);
    myRavenloftGraph.addOneWayStair("K83a", "K83", K83_to_83a);
    myRavenloftGraph.addOneWayEdge("K83a", "K37", 1);


    myRavenloftGraph.addOneWayEdge("K84", "K18-B2", 1);
    myRavenloftGraph.addOneWayEdge("K84", "K81", 1);
    myRavenloftGraph.addOneWayEdge("K84", "K85", 1);
    myRavenloftGraph.addOneWayEdge("K84", "K86", 1);
    myRavenloftGraph.addOneWayEdge("K84", "K87", 1);

    myRavenloftGraph.addOneWayEdge("K85", "K84", 1);

    myRavenloftGraph.addOneWayEdge("K86", "K84", 1);

    myRavenloftGraph.addOneWayEdge("K87", "K84", 1);
    myRavenloftGraph.addOneWayEdge("K87", "K88", 1);

    myRavenloftGraph.addOneWayEdge("K88", "K87", 1);


// Set Room to Map names


    myRavenloftGraph.addRoomsToMap(["K79", "K83", "K83a", "K78", "K77", "K76", "K80", "K74", "K73", "K75", "K81", "K21-B2", "K85", "K84", "K86", "K87", "K88", "K18-B2"], "12");
    myRavenloftGraph.addRoomsToMap(["K72", "K70", "K71", "K67", "K69", "K68", "K64-B1", "K66", "K65", "K61", "K62", "K63", "K18-B1"], "11");
    myRavenloftGraph.addRoomsToMap(["K12-1S", "K12-1N", "K13-1S", "K13-1N", "K22", "K1", "K7", "K13", "K19", "K11", "K10", "K8", "K9", "K20a", "K14", "K24", "K23", "K3", "K16", "K15", "K17", "K6", "K18-F1", "K20-F1", "K64-F1"], "3")
    myRavenloftGraph.addRoomsToMap(["K12-2S", "K12-SN", "K13-2S", "K13-2N", "K22-2S", "K22-2N", "K25", "K32", "K33", "K26", "K30", "K29", "K27", "K31", "K34", "K28", "K20-F1"], "4");
    myRavenloftGraph.addRoomsToMap(["K42", "K43", "K44", "K45", "K46", "K35", "K36", "K37", "K38", "K39", "K31b", "K40", "K41", "K20-F2"], "5");
    myRavenloftGraph.addRoomsToMap(["K47", "K48-M6", "K49", "K50", "K51", "K53", "K20-F3"], "6")
    myRavenloftGraph.addRoomsToMap(["K52", "K54", "K55", "K56"], "7");
    myRavenloftGraph.addRoomsToMap(["K57", "K58", "K20-F4"], "8")
    myRavenloftGraph.addRoomsToMap(["K60", "K60a"], "9");
    myRavenloftGraph.addRoomsToMap(["K59"], "10");

    return myRavenloftGraph;
}



export default class MyGraph {

    private myRavenloftGraph: MyRavenloftGraph;

    constructor() {
        this.myRavenloftGraph = getMyRavenloftGraph();
    }

    getRooms(): string[] {
        const graph = this.myRavenloftGraph.getGraph()
        return Object.keys(graph);
    }

    getShortestPath(start: string, end: string): string[] {
        const graph = this.myRavenloftGraph.getGraph()
        const path = dijkstrajs.find_path(graph, start, end);
        return path;
    }

    activateSecretDoor(secretDoorId: string){
        this.myRavenloftGraph.setSecretDoorsFound(secretDoorId);
    }

    getSecretDoors(): string[] {
        return this.myRavenloftGraph.getSecretDoors();
    }

    getMapColorOfRoom(room: string){
        return this.myRavenloftGraph.getMapColorOfRoom(room);
    }

}
