#!/usr/bin/env node

const fs = require('fs');
const { getEmailHTML } = require('../utils');
const {
  getCurrentEmailHTML,
  getEmailList,
  getEmptyEmailListString
} = require('../../../api/service/send-email-service');
const mockData = require('./mock-data');
const useMockData = process.argv[2] === '--mock';

async function getHTML(useMockData) {
  const emailList = getEmailList();
  const emptyEmailList = getEmptyEmailListString();
  const htmlOutput = useMockData
    ? getEmailHTML(mockData, emailList, emptyEmailList)
    : await getCurrentEmailHTML();

  fs.writeFile('./sample.html', htmlOutput, err => {
    if (err) {
      console.log(err); // eslint-disable-line
      process.exit();
    }
    console.log('Please view the email by using `open sample.html` command'); // eslint-disable-line
    process.exit();
  });
}

getHTML(useMockData);
