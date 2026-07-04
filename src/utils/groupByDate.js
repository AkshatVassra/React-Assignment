import { formatShiftDay, getDateKey } from './date';

export const groupShiftsByDate = (shifts) => {
    if (!shifts) return [];
    
    const buckets = shifts.reduce((accumulator, shift) => {
        const key = getDateKey(shift.startTime);

        if (!accumulator[key]) {
            accumulator[key] = {
                title: formatShiftDay(shift.startTime),
                data: [],
                sortKey: shift.startTime,
                shiftCount: 0,
                totalHours: 0,
            };
        }

        accumulator[key].data.push(shift);
        accumulator[key].shiftCount += 1;
        
        const durationHours = (shift.endTime - shift.startTime) / (1000 * 60 * 60);
        accumulator[key].totalHours += durationHours;
        
        accumulator[key].sortKey = Math.min(accumulator[key].sortKey, shift.startTime);
        return accumulator;
    }, {});

    return Object.values(buckets)
        .sort((left, right) => left.sortKey - right.sortKey)
        .map((group) => ({
            ...group,
            data: group.data.sort((left, right) => left.startTime - right.startTime),
        }));
};