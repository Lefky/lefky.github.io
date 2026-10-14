import test from 'node:test';
import assert from 'node:assert/strict';
import {
	getHistoryKeys,
	getDayRecord,
	saveDayRecord
} from '../js/storage.js';

// Setup mock global localStorage for Node environment testing
const store = {};
global.localStorage = {
	getItem: key => Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null,
	setItem: (key, val) => {
		store[key] = String(val);
		global.localStorage[key] = String(val);
	},
	removeItem: key => {
		delete store[key];
		delete global.localStorage[key];
	},
	clear: () => {
		for (const k in store) {
			delete store[k];
			delete global.localStorage[k];
		}
	}
};

test('saveDayRecord and getDayRecord store and retrieve parsed objects', () => {
	const sample = {
		TotalNoBreakDec: '7.60',
		OvertimeDec: '0.00',
		TotalDec: '8.10',
		StartDec: '8.50',
		HourSchedule: '7.60',
		Summary: 'Unit test work entry'
	};

	saveDayRecord('14-10-2026', sample);
	const retrieved = getDayRecord('14-10-2026');
	assert.deepStrictEqual(retrieved, sample);
});

test('getHistoryKeys returns only valid date keys in chronological ascending order', () => {
	global.localStorage.clear();
	global.localStorage.setItem('14-10-2026', JSON.stringify({}));
	global.localStorage.setItem('01-10-2026', JSON.stringify({}));
	global.localStorage.setItem('25-09-2026', JSON.stringify({}));
	global.localStorage.setItem('autoend', 'true');
	global.localStorage.setItem('hourschedule', '7.6');

	const keys = getHistoryKeys();
	assert.deepStrictEqual(keys, ['25-09-2026', '01-10-2026', '14-10-2026']);
});
