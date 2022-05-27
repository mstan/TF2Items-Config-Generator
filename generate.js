require('dotenv').config();
const TF2ItemsWeapons = require('./lib/TF2ItemsWeapons');
const { SOURCE_FILES_PATH } = process.env; 
const debug = require('debug')('TF2ItemsWeaponsGenerator:app');

async function main() {
	tf2ItemsWeapons = new TF2ItemsWeapons(SOURCE_FILES_PATH);
	await tf2ItemsWeapons.init();
	await tf2ItemsWeapons.build();
}
main();