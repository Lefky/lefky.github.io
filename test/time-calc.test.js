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
	// Test snap threshold (e.g., schedule 7.6)
	assert.strictEqual(calculateWorktime(8, 15.61, 7.6), '7.60');
});

test('calculateOvertime computes positive and negative overtime', () => {
	assert.strictEqual(calculateOvertime(8.5, 0.5, 7.6), '0.40');
	assert.strictEqual(calculateOvertime(7.0, 0.5, 7.6), '-1.10');
	assert.strictEqual(calculateOvertime(8.1, 0.5, 7.6), '0.00');
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
