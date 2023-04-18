import JSONToGraph from "./JSONToGraph";

const csv = require('csvtojson')

export default class ParseStudIPCSVToJSON {

    static getAllTutorsDict(nodes: any): any {
        let tutors = {}
        for(const element of nodes) {
            let node = element
            let tutor = ParseStudIPCSVToJSON.getTutorFromNode(node)
            if(tutor != undefined) {
                // @ts-ignore
                if(!tutors[tutor]) {
                    // @ts-ignore
                    tutors[tutor] = {}
                }
                // @ts-ignore
                let slotForTutor = ParseStudIPCSVToJSON.getSlotFromNode(node)
                // @ts-ignore
                if(!tutors[tutor][slotForTutor.day]) {
                    // @ts-ignore
                    tutors[tutor][slotForTutor.day] = {}
                }
                // @ts-ignore
                tutors[tutor][slotForTutor.day][slotForTutor.time] = true;
            }
        }
        return tutors
    }

    static getTutorFromNode(node: any): string {
        let ort = node["Ort"]
        return ort
    }

    static getSlotFromNode(node: any): any {
        let datum = node["Datum"]
        let splits = datum.split(".");
        let date = new Date();

        date.setFullYear(parseInt(splits[2]), parseInt(splits[1]) - 1, parseInt(splits[0]));
//        date.setDate(parseInt(splits[0]))
  //      date.setFullYear(parseInt(splits[2]))
    //    date.setMonth(parseInt(splits[1]) - 1)

        let day = ParseStudIPCSVToJSON.getWeekday(date)
        let tutor = ParseStudIPCSVToJSON.getTutorFromNode(node)

        let slot = {
            tutor: tutor,
            day: day,
            time: node["Beginn"],
        }
        return slot;
    }

    static getWeekday(date: Date): string{
        return JSONToGraph.getWeekdayByNumber(date.getDay());
    }

    static getAllGroups(nodes: any): any {
        let groups = {}
        let tutorSlotToGroupMembersInformations = {}

        // since not all group members are in the same row, we need to collect them first
        for(const element of nodes) {
            let node = element
            let slotsForGroup = ParseStudIPCSVToJSON.getSlotFromNode(node)
            let tutor = slotsForGroup.tutor
            let day = slotsForGroup.day
            let time = slotsForGroup.time
            let slotId = tutor + "-" + day + "-" + time // get the slot id
            // @ts-ignore
            let tutorSlotToGroupMembersInformation = tutorSlotToGroupMembersInformations[slotId] || {
                slot: slotsForGroup,
                groupMembers: []
            }

            let members = tutorSlotToGroupMembersInformation.groupMembers
            let groupMembers = ParseStudIPCSVToJSON.getGroupMembersFromNode(node) // get the group member
            if(!!groupMembers && groupMembers.length>0) {
                for(const groupMember of groupMembers){
                    members.push(groupMember) // add the group member to the list of group members
                }
                tutorSlotToGroupMembersInformation.groupMembers = members
            }
            // @ts-ignore
            tutorSlotToGroupMembersInformations[slotId] = tutorSlotToGroupMembersInformation
        }

        let slotKeys = Object.keys(tutorSlotToGroupMembersInformations)
        for(const slotKey of slotKeys) {
            // @ts-ignore
            let tutorSlotToGroupMembersInformation = tutorSlotToGroupMembersInformations[slotKey]
            let slotsForGroup = tutorSlotToGroupMembersInformation.slot

            let groupMembers = tutorSlotToGroupMembersInformation.groupMembers

            if(groupMembers != undefined && groupMembers.length>0) {
                let groupId = groupMembers.join(" & ");

                // @ts-ignore
                if(!groups[groupId]) {
                    // @ts-ignore
                    groups[groupId] = {}
                }

                // @ts-ignore
                groups[groupId]["members"] = groupMembers;

                // @ts-ignore
                if(!groups[groupId]["selectedSlot"]) {
                    // @ts-ignore
                    groups[groupId]["selectedSlot"] = slotsForGroup
                }

                // @ts-ignore
                if(!groups[groupId]["possibleSlots"]) {
                    // @ts-ignore
                    groups[groupId]["possibleSlots"] = {}
                }

                // @ts-ignore
                if (!groups[groupId]["possibleSlots"][slotsForGroup.day]) {
                    // @ts-ignore
                    groups[groupId]["possibleSlots"][slotsForGroup.day] = {}
                }
                // @ts-ignore
                groups[groupId]["possibleSlots"][slotsForGroup.day][slotsForGroup.time] = true;
            }
        }
        return groups
    }

    static getGroupMembersFromNode(node: any): any {
        let person = node["Person"]
        console.log("person: "+JSON.stringify(person));
        if(person == "") {
            return undefined
        }
        if(person.length>0){
            if(person.includes("\n")) {
                let parts = person.split("\n")
                return parts
            }
            return [person]
        }
        return undefined
    }

    static getTutorFromSlot(slot: string): string {
        let parts = slot.split("-")
        return parts[2]
    }

    static async parseStudIPCSVToJSON(s: string): Promise<any> {
        let output = await csv({delimiter: ";"}).fromString(s)
        let result = {
            groups: {},
            tutors: {},
            tutorMultipliers: {},
        };

        let tutorDicts = ParseStudIPCSVToJSON.getAllTutorsDict(output)
        // @ts-ignore
        result.tutors = tutorDicts;

        let tutorNames = Object.keys(tutorDicts)
        for(const tutorName of tutorNames) {
            // @ts-ignore
            result.tutorMultipliers[tutorName] = 1;
        }


        let groupDicts = ParseStudIPCSVToJSON.getAllGroups(output)
        // @ts-ignore
        result.groups = groupDicts;

        return result;
    }

    static getGroupsForTutors(parsedAsJSON: any){
        if(!parsedAsJSON) {
            return {}
        }
        let tutorNames = Object.keys(parsedAsJSON.tutors)
        let tutorsWithGroups = {}
        let groupNames = Object.keys(parsedAsJSON.groups)
        for(const groupName of groupNames) {
            let group = parsedAsJSON.groups[groupName]
            let tutorName = group.selectedSlot.tutor
            if(tutorName != undefined) {
                // @ts-ignore
                if(!tutorsWithGroups[tutorName]) {
                    // @ts-ignore
                    tutorsWithGroups[tutorName] = []
                }
                // @ts-ignore
                tutorsWithGroups[tutorName].push({
                    group: groupName,
                    day: group.selectedSlot.day,
                    time: group.selectedSlot.time,
                })
            }
        }
        return tutorsWithGroups
    }

}
