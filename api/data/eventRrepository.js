const Sequelize = require('sequelize');
const events = require('../models/event');
const calendars = require("../models/calendar");
const positions = require("../models/position");

const Op = Sequelize.Op;

module.exports = class EventRepository {
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