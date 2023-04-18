const csv = require('csvtojson')

export default class JSONToGraph {

    static getWeekday(date: Date): string{
        return JSONToGraph.getWeekdayByNumber(date.getDay());
    }

    static getWeekdayTranslation(weekday: string): string {
        let translation = {
            "Monday": "Montag",
            "Tuesday": "Dienstag",
            "Wednesday": "Mittwoch",
            "Thursday": "Donnerstag",
            "Friday": "Freitag",
            "Saturday": "Samstag",
            "Sunday": "Sonntag",
        }
        //@ts-ignore
        return translation[weekday];
    }

    static getWeekdayByNumber(number: number): string {
        number = number % 7;
        let weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        return weekdays[number];
    }

    static getWorkingWeekdays(){
        let offset = 1;
        let weekdays = [];
        for(let i=0; i<5; i++) {
            let weekday = JSONToGraph.getWeekdayByNumber(i + offset);
            weekdays.push(weekday);
        }
        return weekdays;
    }

    static getTimeslots(){
        let startHour = 8;
        let endHour = 20;
        let minuteStep = 15;
        let minutesPerHour = 60;

        let timeslots = [];
        for(let i = startHour; i < endHour; i++){
            for(let j = 0; j < minutesPerHour; j+=minuteStep){
                let hour = i < 10 ? "0" + i : i;
                let minute = j < 10 ? "0" + j : j;
                timeslots.push(hour + ":" + minute);
            }
        }
        return timeslots;
    }

    static getSlotId(slot: any): string {
        return JSONToGraph.getSlotIdFromFields(slot.time, slot.day, slot.tutor);
    }

    static getSlotIdFromFields(time: string, day: string, tutor: string): string {
        return time + "-" + day + "-" + tutor;
    }

    static getAllSlotsFromTutors(parsedJSON: any): any {
        let slots = {}
        let tutorsDict = parsedJSON.tutors;
        let tutors = Object.keys(tutorsDict);
        for(const tutor of tutors) {
            let tutorSlots = tutorsDict[tutor];
            let days = Object.keys(tutorSlots);
            for(const day of days) {
                let timeDict = tutorSlots[day];
                let times = Object.keys(timeDict);
                for(const time of times) {
                    let slot = {
                        tutor: tutor,
                        day: day,
                        time: time,
                    }
                    //@ts-ignore
                    slot.id = JSONToGraph.getSlotId(slot);

                        // @ts-ignore
                    slots[slot.id] = slot
                }
            }
        }
        return slots
    }

    static getGraphAndVerticeMaps(parsedJSON: any, tutorCapacity: number, dictTutorToIndividualDiff?: any): any {
        //console.log("getGraphAndVerticeMaps: with tutorCapacity: "+tutorCapacity)

        let result = {
            source: 0,
            sink: 1,
            graph: {},
            nameToVertice: {},
            verticeToName: {},
            slotsWithNames: {},
        }
        let source = result.source;
        let sink = result.sink;

        let defaultCapacity = 1;
        let groupCapacity = defaultCapacity;
        let currentVertice = 2; // source and sink are 0 and 1

        // Create group verticies
        let groups = parsedJSON.groups;
        let groupNames = Object.keys(groups);
        for(const groupName of groupNames) {
            let groupVertice = currentVertice;
            //@ts-ignore
            result.nameToVertice[groupName] = groupVertice;
            //@ts-ignore
            result.verticeToName[groupVertice] = groupName;
            //@ts-ignore // empty group slot
            result.graph[groupVertice] = result.graph[groupVertice] || {};

            currentVertice += 1;
        }

        // Add edges from source to groups
        for(const groupName of groupNames) {
            //@ts-ignore
            let groupVertice = result.nameToVertice[groupName];

            //@ts-ignore
            result.graph[source] = result.graph[source] || {};
//            console.log("Adding edge from source to groupVertice: "+groupVertice)
            //@ts-ignore
            result.graph[source][groupVertice] = {
                flow: 0,
                capacity: groupCapacity,
                from: source,
                type: "source-to-group",
                to: groupVertice,
            };
        }

        // Create slot verticies
        let slotsWithNames = JSONToGraph.getAllSlotsFromTutors(parsedJSON)
        result.slotsWithNames = slotsWithNames;

        let slots = Object.keys(slotsWithNames);
        for(const slot of slots) {
            let slotVertice = currentVertice;
            //@ts-ignore
            result.nameToVertice[slot] = slotVertice;
            //@ts-ignore
            result.verticeToName[slotVertice] = slot;
            //@ts-ignore // empty slot
            result.graph[slotVertice] = result.graph[slotVertice] || {};

            currentVertice += 1;
        }


        // Add edges from groups possibleSlots to slots
        for(const groupName of groupNames) {
            //@ts-ignore
            let groupVertice = result.nameToVertice[groupName];
            let group = groups[groupName];
            let groupPossibleSlots = group.possibleSlots;
            let days = Object.keys(groupPossibleSlots);
            for(const day of days) {
                let timeDict = groupPossibleSlots[day];
                let times = Object.keys(timeDict);
                for(const time of times) {
                    let allSlotNames = Object.keys(slotsWithNames);
                    for(const slotName of allSlotNames) {
                        let slot = slotsWithNames[slotName];
                        if(slot.day === day && slot.time === time) {
                            //@ts-ignore
                            let slotVertice = result.nameToVertice[slotName];
                            //@ts-ignore
                            result.graph[groupVertice] = result.graph[groupVertice] || {};

                            //console.log("Adding edge from groupVertice: "+groupVertice+" to slotVertice: "+slotVertice)
                            //@ts-ignore
                            result.graph[groupVertice][slotVertice] = {
                                flow: 0,
                                capacity: defaultCapacity,
                                from: groupVertice,
                                type: "group-to-slot",
                                to: slotVertice,
                            };
                        }
                    }
                }
            }
        }


        // Create tutor verticies
        let tutorsDict = parsedJSON.tutors;
        let tutors = Object.keys(tutorsDict);
        for(const tutor of tutors) {
            let tutorVertice = currentVertice;
            //@ts-ignore
            result.nameToVertice[tutor] = tutorVertice;
            //@ts-ignore
            result.verticeToName[tutorVertice] = tutor;
            //@ts-ignore // empty tutor slot
            result.graph[tutorVertice] = result.graph[tutorVertice] || {};

            currentVertice += 1;
        }

        // Add edges from slots to tutors
        for(const slot of slots) {
            //@ts-ignore
            let slotVertice = result.nameToVertice[slot];
            let slotInfo = slotsWithNames[slot];
            let tutor = slotInfo.tutor;
            //@ts-ignore
            let tutorVertice = result.nameToVertice[tutor];
            //@ts-ignore
            result.graph[slotVertice] = result.graph[slotVertice] || {};
            //console.log("Adding edge from slotVertice: "+slotVertice+" to tutorVertice: "+tutorVertice)
            //@ts-ignore
            result.graph[slotVertice][tutorVertice] = {
                flow: 0,
                capacity: defaultCapacity,
                from: slotVertice,
                type: "slot-to-tutor",
                to: tutorVertice,
            };
        }

        // Add edges from tutors to sink
        for(const tutor of tutors) {
            //@ts-ignore
            let tutorVertice = result.nameToVertice[tutor];
            //@ts-ignore
            result.graph[tutorVertice] = result.graph[tutorVertice] || {};

            let multiplier = 1;
            let individualMultiplier = parsedJSON?.tutorMultipliers?.[tutor];
            if(individualMultiplier !== undefined) {
                multiplier = individualMultiplier;
            }
            let individualTutorCapacity = Math.floor(tutorCapacity * multiplier);

            if(!!dictTutorToIndividualDiff){
                if(dictTutorToIndividualDiff[tutor] !== undefined){
                    let individualDiff = dictTutorToIndividualDiff[tutor];
                    individualTutorCapacity += individualDiff;
                }
            }

            //console.log("Adding edge from tutorVertice: "+tutorVertice+" to sink: "+sink)
            //@ts-ignore
            result.graph[tutorVertice][sink] = {
                flow: 0,
                capacity: individualTutorCapacity,
                from: tutorVertice,
                type: "tutor-to-sink",
                to: sink,
            };
        }

        //@ts-ignore
        result.graph[sink] = result.graph[sink] || {};

        //console.log("Amount groups: "+groupNames.length);
        //console.log("Amount slots: "+slots.length);
        //console.log("Amount tutors: "+tutors.length);

//        console.log(JSON.stringify(result.graph, null, 2));


        return result
    }

}
