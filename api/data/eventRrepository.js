const Sequelize = require('sequelize');
const events = require('../models/event').events;
const calendars = require("../models/calendar").calendars;
const positions = require("../models/position").positions;

const Op = Sequelize.Op;

class EventRepository {
    constructor(){
        this.queryKeyValuePair = [];
        this.calendarKeyValuePair = [];
    }

    all(){
        return this;
    }

    from(inclusiveStartDate){
        this.calendarKeyValuePair.push({key: 'date', value: {[Op.gte]: inclusiveStartDate}});
        return this;
    }

    to(inclusiveEndDate){
        this.calendarKeyValuePair.push({key: 'date', value: {[Op.lte]: inclusiveEndDate}});
        return this;
    }

    between(inclusiveStartDate, inclusiveEndDate){
        this.calendarKeyValuePair.push({key: 'date', value: {[Op.gte]: inclusiveStartDate, [Op.lte]: inclusiveEndDate}});
        return this;
    }

    id(id){
        this.queryKeyValuePair.push({key: 'id', value: id});
        return this;
    }

    executeAsync(){
        let whereClause = {};
        let calendarWhereClause = {};
        this.queryKeyValuePair.map((kvp) => {
            whereClause[kvp.key] = kvp.value;
        });
        this.calendarKeyValuePair.map((kvp) => {
            calendarWhereClause[kvp.key] = kvp.value;
        });

        return events.findAll({where: whereClause, include: [
            {model: calendars, as: 'calendar', where: calendarWhereClause }, 
            {model: positions, as: 'position' }]
        });
    }
}

export const EventRepository;