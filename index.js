import * as dotenv from 'dotenv';
import fetch from "node-fetch";
import moment from 'moment';

dotenv.config();

// Get current time (END_TIME) and 1 hour prior (START_TIME)
const START_TIME = moment().subtract(1, 'hour').format('YYYYMMDDHHmm');
const END_TIME = moment().format('YYYYMMDDHHmm');

const GOOD_DIRECTIONS = ['S', 'SSW', 'SSE'];

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

/**
 * Given some weather data, return whether or not those conditions are flyable.
 * 
 * @param {Number[]} precip | Precipitation accumulated in last 5 minutes in millimeters
 * @param {Number[]} wind_speed | Wind speed at given time in miles per hour
 * @param {String[]} wind_dir | Cardinal direction of wind at given time
 * @returns {Boolean} | Whether or not the current conditions are flyable
 */
const isFlyable = (precip, wind_speed, wind_dir) => {
    // Check if any rain has fallen
    const isRaining = precip.find(i => i != 0) === undefined ? false : true;
    if (isRaining) return false;
    console.log('Rain check good ✅')

    // Check wind direction, good values are S, SSW, SSE
    let good_dirs = 0;
    for (let i = 0; i < wind_dir.length; i++) {
        if (GOOD_DIRECTIONS.includes(wind_dir[i])) good_dirs++;
    }
    if (good_dirs / wind_dir.length < 0.6) return false;
    console.log('Wind direction check good ✅')

    // Check wind speeds, good values are 5-15
    let good_speeds = 0;
    for (let i = 0; i < wind_speed.length; i++) {
        if (wind_speed[i] >= 5 && wind_speed[i] <= 15) good_speeds++;
    }
    if (good_speeds / wind_speed.length < 0.8) return false;
    console.log('Wind speed check good ✅')

    return true;
}

console.log(isFlyable(
    observations.precip_accum_five_minute_set_1,
    observations.wind_speed_set_1,
    observations.wind_cardinal_direction_set_1d
));