require('dotenv').config()
const rpio = require('rpio');
const moment = require('moment');
const fetch = require('node-fetch');

// Set pins 5 & 7 to output for LEDs
rpio.open(5, rpio.OUTPUT, rpio.LOW); // Red
rpio.open(7, rpio.OUTPUT, rpio.LOW); // Green

// Get current time (END_TIME) and 1 hour prior (START_TIME)
const START_TIME = moment().subtract(1, 'hour').format('YYYYMMDDHHmm');
const END_TIME = moment().format('YYYYMMDDHHmm');

const GOOD_DIRECTIONS = ['S', 'SSW', 'SSE'];

// https://developers.synopticdata.com/mesonet/explorer/
const URL = `https://api.synopticdata.com/v2/stations/timeseries?&token=${process.env.API_TOKEN}&stid=FPS,UUNET&status=active&output=json&start=${START_TIME}&end=${END_TIME}&units=temp|f,speed|mph`

const main = async () => {
	const response = await fetch(URL);
	const body = await response.json();

	/**
	 * Returns an object containing weather dataset.
	 * Data will be listed in order from START_TIME to END_TIME.
	 * Important fields: 
	 * wind_speed_set_1, wind_cardinal_direction_set_1d, precip_accum_five_minute_set_1
	 */
	const observations = body.STATION[0].OBSERVATIONS;

	if (isFlyable(
	    observations.precip_accum_five_minute_set_1,
	    observations.wind_speed_set_1,
	    observations.wind_cardinal_direction_set_1d
	)) {
        rpio.write(7, rpio.HIGH);
        rpio.write(5, rpio.LOW);
    } else {
        rpio.write(7, rpio.LOW);
        rpio.write(5, rpio.HIGH);
    }
}

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
    if (isRaining) {
        console.log('Rain check failed ❌');
        return false;
    }
    console.log('Rain check good ✅');

    // Check wind direction, good values are S, SSW, SSE
    let good_dirs = 0;
    for (let i = 0; i < wind_dir.length; i++) {
        if (GOOD_DIRECTIONS.includes(wind_dir[i])) good_dirs++;
    }
    if (good_dirs / wind_dir.length < 0.6) {
        console.log('Wind direction check failed ❌');
        return false;
    }
    console.log('Wind direction check good ✅');

    // Check wind speeds, good values are 5-15
    let good_speeds = 0;
    for (let i = 0; i < wind_speed.length; i++) {
        if (wind_speed[i] >= 5 && wind_speed[i] <= 15) good_speeds++;
    }
    if (good_speeds / wind_speed.length < 0.8) {
        console.log('Wind speed check failed ❌');
        return false;
    }
    console.log('Wind speed check good ✅');

    // All check have passed!
    return true;
}

main();

