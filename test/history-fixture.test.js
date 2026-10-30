import test from 'node:test';
import assert from 'node:assert/strict';
import { createSampleHistory } from './fixtures/sample-history.js';

test('sample history uses recent dates relative to today and excludes today', () => {
	const today = new Date(2026, 9, 30, 12);
	const samples = createSampleHistory(today);

	assert.equal(samples.length, 60);
	assert.deepEqual(samples.map(sample => sample.daysAgo), Array.from({ length: 60 }, (_, index) => index + 1));
	assert.equal(new Set(samples.map(sample => sample.dateKey)).size, samples.length);
	for (const sample of samples) {
		const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(sample.dateKey);
		assert.ok(match, `${sample.dateKey} is not DD-MM-YYYY`);
		const expectedDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - sample.daysAgo);
		assert.equal(match[1], String(expectedDate.getDate()).padStart(2, '0'));
		assert.equal(match[2], String(expectedDate.getMonth() + 1).padStart(2, '0'));
		assert.equal(match[3], String(expectedDate.getFullYear()));
		assert.ok(sample.daysAgo >= 1 && sample.daysAgo <= 60);
	}
});

test('sample history contains varied, internally consistent work records', () => {
	const samples = createSampleHistory(new Date(2026, 9, 30, 12));
	const records = samples.map(sample => sample.record);
	const overtime = records.map(record => Number(record.OvertimeDec));
	const schedules = new Set(records.map(record => record.HourSchedule));
	const breaks = new Set(records.map(record => (
		Number(record.TotalDec) - Number(record.TotalNoBreakDec)
	).toFixed(2)));

	assert.ok(overtime.some(value => value > 0));
	assert.ok(overtime.some(value => value < 0));
	assert.ok(overtime.some(value => value === 0));
	assert.ok(schedules.size >= 4);
	assert.ok(breaks.size >= 3);
	assert.ok(records.every(record => record.Summary.length > 0));

	for (const record of records) {
		assert.ok(Number.isFinite(Number(record.StartDec)));
		assert.ok(Number.isFinite(Number(record.TotalDec)));
		assert.ok(Number.isFinite(Number(record.TotalNoBreakDec)));
		assert.ok(Number.isFinite(Number(record.OvertimeDec)));
		assert.ok(Number.isFinite(Number(record.HourSchedule)));
		assert.ok(Math.abs(
			Number(record.TotalNoBreakDec) - Number(record.HourSchedule) - Number(record.OvertimeDec)
		) < 0.001);
		assert.ok(Number(record.TotalDec) >= Number(record.TotalNoBreakDec));
	}

	const overnight = samples.find(sample => sample.record.Summary.includes('Overnight'));
	assert.ok(overnight);
	assert.equal(Number(overnight.record.StartDec), 22);
	assert.equal(Number(overnight.record.TotalDec), 8.5);
});
