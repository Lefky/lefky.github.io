import test from 'node:test';
import assert from 'node:assert/strict';
import {
	floatToTimeString,
	timeStringToFloat,
	reverseDateRepresentation,
	testDateFormat,
	calculateWorktime,
	calculateOvertime,
	calculateTotalNoBreak,
	escapeHtml,
	Timer
} from '../js/time-calc.js';

test('floatToTimeString converts decimals to HH:mm string', () => {
	assert.strictEqual(floatToTimeString(0), '00:00');
	assert.strictEqual(floatToTimeString(7.5), '07:30');
	assert.strictEqual(floatToTimeString(8.25), '08:15');
	assert.strictEqual(floatToTimeString(16.75), '16:45');
	assert.strictEqual(floatToTimeString(-1.5), '-01:30');
	assert.strictEqual(floatToTimeString('correction'), 'correction');
	// Floating point values that previously suffered from Math.floor truncation bugs
	assert.strictEqual(floatToTimeString(16.083333333333332), '16:05');
	assert.strictEqual(floatToTimeString(16.583333333333332), '16:35');
	assert.strictEqual(floatToTimeString(8.416666666666666), '08:25');
});

test('timeStringToFloat converts HH:mm string to decimal hours', () => {
	assert.strictEqual(timeStringToFloat('00:00'), 0);
	assert.strictEqual(timeStringToFloat('07:30'), 7.5);
	assert.strictEqual(timeStringToFloat('08:15'), 8.25);
	assert.strictEqual(timeStringToFloat('12:00'), 12);
	assert.strictEqual(timeStringToFloat(''), 0);
});

test('reverseDateRepresentation toggles between DD-MM-YYYY and YYYY-MM-DD', () => {
	assert.strictEqual(reverseDateRepresentation('14-10-2026'), '2026-10-14');
	assert.strictEqual(reverseDateRepresentation('2026-10-14'), '14-10-2026');
	assert.strictEqual(reverseDateRepresentation(''), '');
});

test('testDateFormat validates DD-MM-YYYY format', () => {
	assert.strictEqual(testDateFormat('14-10-2026'), true);
	assert.strictEqual(testDateFormat('01-01-2025'), true);
	assert.strictEqual(testDateFormat('2026-10-14'), false);
	assert.strictEqual(testDateFormat('autoend'), false);
	assert.strictEqual(testDateFormat(''), false);
});

test('calculateWorktime computes normal hours and midnight crossing', () => {
	assert.strictEqual(calculateWorktime(8, 16.5), '8.50');
	assert.strictEqual(calculateWorktime(22, 6), '8.00');
	// Test snap threshold without break
	assert.strictEqual(calculateWorktime(8, 15.61, 7.6), '7.60');
	// Test snap threshold WITH break (8.0 + 7.6 + 0.5 = 16.1)
	assert.strictEqual(calculateWorktime(8, 16.11, 7.6, 0.5), '8.10');
	// Test snap threshold with fractional schedule (6.24h + 0.5h break -> 14:44 = 14.7333h)
	assert.strictEqual(calculateWorktime(8, 14.7333, 6.24, 0.5), '6.74');
});

test('calculateOvertime computes positive and negative overtime', () => {
	assert.strictEqual(calculateOvertime(8.5, 0.5, 7.6), '0.40');
	assert.strictEqual(calculateOvertime(7.0, 0.5, 7.6), '-1.10');
	assert.strictEqual(calculateOvertime(8.1, 0.5, 7.6), '0.00');
	// Prevents false -0.01 overtime on fractional minute schedules (3.04h, 6.24h)
	assert.strictEqual(calculateOvertime(3.0333, 0, 3.04), '0.00');
	assert.strictEqual(calculateOvertime(6.7333, 0.5, 6.24), '0.00');
	// Preserves real 1-minute early or late deviations (0.0167h)
	assert.strictEqual(calculateOvertime(7.98, 0, 8.0), '-0.02');
	assert.strictEqual(calculateOvertime(8.02, 0, 8.0), '0.02');
});

test('calculateTotalNoBreak deducts break correctly', () => {
	assert.strictEqual(calculateTotalNoBreak(8.5, 0.5), '8.00');
	assert.strictEqual(calculateTotalNoBreak(9.2, 0.75), '8.45');
});

test('escapeHtml handles dangerous HTML characters', () => {
	assert.strictEqual(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
	assert.strictEqual(escapeHtml("Tom & Jerry's"), 'Tom &amp; Jerry&#039;s');
	assert.strictEqual(escapeHtml(''), '');
});

test('Timer tracks elapsed time accurately', async () => {
	const timer = new Timer();
	assert.strictEqual(timer.getTime(), 0);
	timer.start();
	assert.strictEqual(timer.isRunning, true);

	await new Promise(resolve => setTimeout(resolve, 50));
	timer.stop();
	assert.strictEqual(timer.isRunning, false);
	assert.ok(timer.getTime() >= 40);

	timer.reset();
	assert.strictEqual(timer.getTime(), 0);
});

test('floatToTimeString handles edge values and invalid inputs', () => {
	assert.strictEqual(floatToTimeString(null), '00:00');
	assert.strictEqual(floatToTimeString(undefined), '00:00');
	assert.strictEqual(floatToTimeString('not-a-number'), '00:00');
	assert.strictEqual(floatToTimeString(NaN), '00:00');
	assert.strictEqual(floatToTimeString(24), '24:00');
	assert.strictEqual(floatToTimeString(23.983333333333334), '23:59');
	assert.strictEqual(floatToTimeString(-0.08333333333333333), '-00:05');
});

test('timeStringToFloat handles edge formats and invalid inputs', () => {
	assert.strictEqual(timeStringToFloat(''), 0);
	assert.strictEqual(timeStringToFloat(null), 0);
	assert.strictEqual(timeStringToFloat(undefined), 0);
	assert.strictEqual(timeStringToFloat('invalid'), 0);
	assert.strictEqual(timeStringToFloat('08:05'), 8 + 5 / 60);
	assert.strictEqual(timeStringToFloat('23:59'), 23 + 59 / 60);
});

test('calculateWorktime handles midnight crossing with breaks and fractional hours', () => {
	// Shift from 22:00 to 06:30 (8.5h total), scheduled 8h with 0.5h break -> snap to 8.50
	assert.strictEqual(calculateWorktime(22, 6.5, 8.0, 0.5), '8.50');
	// Shift from 23:00 to 07:00 (8.0h total)
	assert.strictEqual(calculateWorktime(23, 7), '8.00');
	// Zero duration (start equals end)
	assert.strictEqual(calculateWorktime(8, 8), '0.00');
});

test('calculateTotalNoBreak handles zero and fractional values', () => {
	assert.strictEqual(calculateTotalNoBreak(0, 0), '0.00');
	assert.strictEqual(calculateTotalNoBreak(8, 0), '8.00');
	assert.strictEqual(calculateTotalNoBreak('invalid', 0.5), '0.50');
});

