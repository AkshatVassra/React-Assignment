const dateFormatterCache = new Map();

const getFormatter = (key, options) => {
    if (!dateFormatterCache.has(key)) {
        dateFormatterCache.set(key, new Intl.DateTimeFormat('en-US', options));
    }

    return dateFormatterCache.get(key);
};

export const getDateKey = (timestamp) => new Date(timestamp).toDateString();

export const formatShiftDay = (timestamp) =>
    getFormatter('day', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
    }).format(new Date(timestamp));

export const formatShiftTime = (startTime, endTime) => {
    const timeFormatter = getFormatter('time', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });

    return `${timeFormatter.format(new Date(startTime))} - ${timeFormatter.format(new Date(endTime))}`;
};

export const formatShiftRange = (shift) => `${formatShiftDay(shift.startTime)} · ${formatShiftTime(shift.startTime, shift.endTime)}`;