import fetch from "node-fetch";
import * as cheerio from 'cheerio';

const URL = 'https://mesowest.utah.edu/cgi-bin/droman/meso_table_mesowest.cgi?stn=FPS&unit=0&month1=&day1=0&year1=&hour1=00&time=LOCAL&past=0'

const response = await fetch(URL);
const body = await response.text();

// console.log(body);

const $ = cheerio.load(body);

console.log($('tr td').text());