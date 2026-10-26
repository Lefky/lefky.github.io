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

test('getHistoryKeys sorts chronologically across year and month boundaries', () => {
	global.localStorage.clear();
	global.localStorage.setItem('05-01-2026', JSON.stringify({}));
	global.localStorage.setItem('31-12-2025', JSON.stringify({}));
	global.localStorage.setItem('15-06-2024', JSON.stringify({}));
	global.localStorage.setItem('28-02-2025', JSON.stringify({}));

	const keys = getHistoryKeys();
	assert.deepStrictEqual(keys, ['15-06-2024', '28-02-2025', '31-12-2025', '05-01-2026']);
});

test('getDayRecord returns null for non-existent records and handles corrupt JSON', () => {
	global.localStorage.clear();
	assert.strictEqual(getDayRecord('non-existent-key'), null);

	global.localStorage.setItem('01-01-2026', 'corrupt-not-json');
	assert.strictEqual(getDayRecord('01-01-2026'), null);
});

