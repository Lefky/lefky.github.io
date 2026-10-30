import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { notificationClosed } from '../js/ui.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const releaseNotes = readFileSync(new URL('../RELEASE_NOTES.md', import.meta.url), 'utf8');
const uiSource = readFileSync(new URL('../js/ui.js', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../css/bootstrap_specific_style.css', import.meta.url), 'utf8');

test('weekly overtime action is grouped after End time now, outside the end-time input row', () => {
	const buttonIndex = html.indexOf('id="applyWeeklyOvertimeButton"');
	const endTimeNowMatch = /title="Sets the 'Time to go home' field to the current time\.">End time\s+now<\/button>/.exec(html);
	const endTimeNowIndex = endTimeNowMatch ? endTimeNowMatch.index : -1;
	const groupStart = html.lastIndexOf('<div class="btn-group" role="group">', endTimeNowIndex);
	const groupEnd = html.indexOf('</div>', buttonIndex);
	const endTimeRowStart = html.indexOf('<div id="divendtime"');
	const nextRowStart = html.indexOf('<div id="divtotalnobreaktime"', endTimeRowStart);

	assert.notEqual(buttonIndex, -1);
	assert.notEqual(endTimeNowIndex, -1);
	assert.ok(groupStart < endTimeNowIndex && endTimeNowIndex < buttonIndex && buttonIndex < groupEnd);
	assert.ok(buttonIndex < endTimeRowStart || buttonIndex > nextRowStart);
	assert.doesNotMatch(html.slice(endTimeRowStart, nextRowStart), /applyWeeklyOvertimeButton/);
	assert.match(html.slice(buttonIndex, groupEnd), /<i class="fal fa-minus"><\/i> Use overtime/);
	assert.doesNotMatch(html.slice(buttonIndex, groupEnd), /Use weekly OT/);
});

test('main history preview keeps its rounded frame and separate header fixed while rows scroll', () => {
	assert.match(uiSource, /history-preview-table'><colgroup><col><col><col><\/colgroup><tbody>/);
	assert.match(uiSource, /getElementById\("historyheader"\)/);
	assert.match(styles, /#historyheader \.history-preview-table,\s*#history \.history-preview-table\s*\{[^}]*table-layout:\s*fixed;/);
	assert.match(styles, /#historycontainer\s*\{[^}]*height:\s*150px;[^}]*overflow:\s*hidden;/);
	assert.match(styles, /#historyheader\s*\{[^}]*flex:\s*0 0 32px;[^}]*overflow:\s*hidden;[^}]*scrollbar-gutter:\s*stable;/);
	assert.match(styles, /#history\s*\{[^}]*overflow-y:\s*auto;[^}]*overflow-x:\s*hidden;[^}]*scrollbar-gutter:\s*stable;/);
	assert.match(styles, /#historyheader \.history-preview-table col,\s*#history \.history-preview-table col\s*\{\s*width:\s*33\.333%;/);
	assert.match(styles, /#historyheader \.history-preview-table th\s*\{[^}]*height:\s*31px;/);
	assert.doesNotMatch(styles, /#history \.history-preview-table th\s*\{[^}]*position:\s*sticky;/);
	assert.doesNotMatch(styles, /#edit_history_table_object[^}]*history-preview-table/);
});

test('release-note version headings use version identifiers, including the planned release', () => {
	const headings = releaseNotes.match(/^### .+$/gm) ?? [];

	assert.ok(headings.length > 0);
	assert.ok(headings.every(heading => /^### \d{8}\.\d+$/.test(heading)));
	assert.doesNotMatch(releaseNotes, /Published on `master`/);
	assert.doesNotMatch(releaseNotes, /^## Unreleased$/m);
	assert.match(releaseNotes, /^### 20261030\.1$/m);
	assert.match(releaseNotes, /Use saved overtime earned earlier this week/);
	assert.doesNotMatch(releaseNotes, /Rename the quick action to “Use overtime”/);
});

test('release notice uses the planned version and includes the previous published release', () => {
	assert.match(html, /id="alertnotification" data-notification-version="20261030\.1"/);
	assert.match(html, /<section aria-label="20261030\.1 release notes">\s*<p><strong>20261030\.1<\/strong><\/p>/);
	assert.doesNotMatch(html, /Unreleased changes/);
	assert.doesNotMatch(html, /These notes collect changes since the last release merge/);
	assert.match(html, /Previous release: 20261026\.2/);
	assert.match(html, /Rotation for mobile screens is now better handled/);
});

test('notification dismissal tracks the planned version separately from the About release version', () => {
	const previousDocument = globalThis.document;
	const previousStorage = globalThis.localStorage;
	const values = new Map([['lastnotifversion', '20261026.2']]);
	const classes = new Set();
	const notification = {
		dataset: { notificationVersion: '20261030.1' },
		style: {},
		classList: { add: name => classes.add(name) }
	};

	globalThis.document = {
		getElementById: id => id === 'currentappversion'
			? { innerHTML: '20261026.2' }
			: id === 'alertnotification' ? notification : null
	};
	globalThis.localStorage = {
		getItem: key => values.get(key) ?? null,
		setItem: (key, value) => values.set(key, String(value))
	};

	try {
		notificationClosed('onload');
		assert.equal(notification.style.display, 'block');
		assert.ok(classes.has('show'));

		notificationClosed('click');
		assert.equal(values.get('lastnotifversion'), '20261030.1');

		notification.style.display = 'none';
		classes.clear();
		notificationClosed('onload');
		assert.equal(notification.style.display, 'none');
		assert.equal(classes.has('show'), false);
	} finally {
		if (previousDocument === undefined) delete globalThis.document;
		else globalThis.document = previousDocument;
		if (previousStorage === undefined) delete globalThis.localStorage;
		else globalThis.localStorage = previousStorage;
	}
});
