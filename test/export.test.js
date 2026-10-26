import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCSV, processImportPayload } from '../js/export.js';

test('formatCSV converts structured records into valid comma-separated rows', () => {
	const records = [
		{
			Date: '14-10-2026',
			StartDec: '8.00',
			TotalNoBreakDec: '7.60',
			OvertimeDec: '0.00',
			Summary: 'Test day'
		},
		{
			Date: '15-10-2026',
			StartDec: '8.50',
			TotalNoBreakDec: '8.10',
			OvertimeDec: '0.50',
			Summary: 'Extra work'
		}
	];

	const csv = formatCSV(records);
	const lines = csv.split('\r\n');

	assert.strictEqual(lines.length, 3);
	assert.strictEqual(lines[0], 'Date,StartDec,TotalNoBreakDec,OvertimeDec,Summary');
	assert.strictEqual(lines[1], '"14-10-2026","8.00","7.60","0.00","Test day"');
	assert.strictEqual(lines[2], '"15-10-2026","8.50","8.10","0.50","Extra work"');
});

test('formatCSV handles empty array gracefully', () => {
	assert.strictEqual(formatCSV([]), '');
	assert.strictEqual(formatCSV(null), '');
});

test('processImportPayload correctly stores parsed JSON payload in target storage', () => {
	const mockStorage = {
		data: {},
		setItem(k, v) {
			this.data[k] = String(v);
		},
		getItem(k) {
			return this.data[k] || null;
		}
	};

	const payload = {
		'14-10-2026': JSON.stringify({
			TotalNoBreakDec: '7.60',
			OvertimeDec: '0.00'
		}),
		hourschedule: '7.6',
		autoend: 'true'
	};

	const importedCount = processImportPayload(payload, mockStorage);

	assert.strictEqual(importedCount, 3);
	assert.strictEqual(mockStorage.getItem('hourschedule'), '7.6');
	assert.strictEqual(mockStorage.getItem('autoend'), 'true');
	const parsedRecord = JSON.parse(mockStorage.getItem('14-10-2026'));
	assert.strictEqual(parsedRecord.TotalNoBreakDec, '7.60');
});

test('processImportPayload rejects invalid non-object payload', () => {
	assert.throws(() => {
		processImportPayload('not-an-object');
	}, /Invalid import payload/);
});
