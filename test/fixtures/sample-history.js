const samplePatterns = [
	{
		start: 8,
		totalNoBreak: 8.5,
		schedule: 7.6,
		breakDuration: 0.5,
		summary: "Regular day with positive overtime"
	},
	{
		start: 9.25,
		totalNoBreak: 7.1,
		schedule: 7.6,
		breakDuration: 0.25,
		summary: "Short day with a small overtime deficit"
	},
	{
		start: 8.5,
		totalNoBreak: 7.6,
		schedule: 7.6,
		breakDuration: 0.5,
		summary: "On schedule"
	},
	{
		start: 6,
		totalNoBreak: 4.3,
		schedule: 3.8,
		breakDuration: 0.5,
		summary: "Short schedule with overtime"
	},
	{
		start: 22,
		totalNoBreak: 8,
		schedule: 7.6,
		breakDuration: 0.5,
		summary: "Overnight shift, 22:00 to 06:30"
	},
	{
		start: 7.5,
		totalNoBreak: 8.25,
		schedule: 8,
		breakDuration: 0.5,
		summary: "Long schedule with a quarter-hour surplus"
	},
	{
		start: 8.5,
		totalNoBreak: 7.35,
		schedule: 7.6,
		breakDuration: 0.25,
		summary: "Regular day with a small deficit"
	},
	{
		start: 8,
		totalNoBreak: 4,
		schedule: 4,
		breakDuration: 0,
		summary: "Half-day without a break"
	},
	{
		start: 8,
		totalNoBreak: 8.75,
		schedule: 8,
		breakDuration: 0.5,
		summary: "Long day with a longer break"
	}
];

const sampleRecords = Array.from({ length: 60 }, (_, index) => {
	const daysAgo = index + 1;
	const pattern = samplePatterns[index % samplePatterns.length];
	return {
		...pattern,
		daysAgo,
		summary: daysAgo <= samplePatterns.length
			? pattern.summary
			: `${pattern.summary} (${daysAgo} days ago)`
	};
});

function formatDateKey(date) {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	return `${day}-${month}-${date.getFullYear()}`;
}

export function createSampleHistory(today = new Date()) {
	return sampleRecords.map(({ daysAgo, start, totalNoBreak, schedule, breakDuration, summary }) => {
		const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
		const overtime = totalNoBreak - schedule;
		return {
			dateKey: formatDateKey(date),
			daysAgo,
			record: {
				StartDec: start.toFixed(2),
				TotalDec: (totalNoBreak + breakDuration).toFixed(2),
				TotalNoBreakDec: totalNoBreak.toFixed(2),
				OvertimeDec: overtime.toFixed(2),
				HourSchedule: schedule.toFixed(2),
				Summary: summary
			}
		};
	});
}
