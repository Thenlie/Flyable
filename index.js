import * as dotenv from 'dotenv';
import fetch from "node-fetch";
import moment from 'moment';

dotenv.config();

// Get current time (END_TIME) and 1 hour prior (START_TIME)
const START_TIME = moment().subtract(1, 'hour').format('YYYYMMDDHHmm');
const END_TIME = moment().format('YYYYMMDDHHmm');

const URL = `https://api.synopticdata.com/v2/stations/timeseries?&token=${process.env.API_TOKEN}&stid=FPS,UUNET&status=active&output=json&start=${START_TIME}&end=${END_TIME}&units=temp|f,speed|mph`

const response = await fetch(URL);
const body = await response.json();

/**
 * Returns an object containing weather dataset.
 * Data will be listed in order from START_TIME to END_TIME.
 * Important fields: 
 * wind_speed_set_1, wind_cardinal_direction_set_1d, precip_accum_five_minute_set_1
 */
const observations = body.STATION[0].OBSERVATIONS;

console.log(observations);
