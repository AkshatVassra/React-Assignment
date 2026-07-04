import React, { useMemo } from 'react';
import { ActivityIndicator, RefreshControl, SectionList, View } from 'react-native';
import styled from 'styled-components/native';

import { DateSection } from '../components/DateSection';
import { EmptyState } from '../components/EmptyState';
import { FilterBar } from '../components/FilterBar';
import { ShiftCard } from '../components/ShiftCard';
import { useBookShift, useCancelShift, useShifts } from '../api/queries';
import { useUIStore } from '../store/uiStore';
import { groupShiftsByDate } from '../utils/groupByDate';

export function AvailableShiftsScreen() {
    const { selectedCity, setSelectedCity } = useUIStore();
    const { data: shifts = [], isLoading, isError, error, isRefetching, refetch } = useShifts();
    const { mutate: bookShift, isPending: isBooking, variables: bookingShiftId } = useBookShift();
    const { mutate: cancelShift, isPending: isCanceling, variables: cancelingShiftId } = useCancelShift();

    const bookedShifts = useMemo(() => shifts.filter((shift) => shift.booked), [shifts]);

    const isOverlapping = (shift) => {
        return bookedShifts.some(
            (bookedShift) =>
            shift.id !== bookedShift.id &&
            shift.startTime < bookedShift.endTime &&
            shift.endTime > bookedShift.startTime
        );
    };

    const cities = useMemo(() => {
        const uniqueCities = [...new Set(shifts.map((shift) => shift.area))];
        return ['All', ...uniqueCities.sort()];
    }, [shifts]);

    const availableShifts = useMemo(() => shifts, [shifts]);

    const shiftCounts = useMemo(() => {
        const counts = {};
        availableShifts.forEach((shift) => {
            counts[shift.area] = (counts[shift.area] || 0) + 1;
        });
        return counts;
    }, [availableShifts]);

    const availableGroups = useMemo(() => {
        const filtered = selectedCity === 'All' ?
            availableShifts :
            availableShifts.filter((shift) => shift.area === selectedCity);

        return groupShiftsByDate(filtered);
    }, [availableShifts, selectedCity]);

    if (isLoading) {
        return React.createElement(
            LoaderWrap,
            null,
            React.createElement(ActivityIndicator, { size: 'large', color: '#004FB4' }),
            React.createElement(LoaderText, null, 'Loading available shifts')
        );
    }

    if (isError) {
        return React.createElement(
            LoaderWrap,
            null,
            React.createElement(
                LoaderText, { style: { color: 'red', textAlign: 'center', padding: 20 } },
                error && error.message || 'Failed to fetch shifts. Please make sure the API server (npm run api) is running!'
            )
        );
    }

    const now = Date.now();
    const isFilteredCity = selectedCity !== 'All';
    const emptyTitle = isFilteredCity ?
        `No available shifts in ${selectedCity} right now.` :
        'No shifts match this filter';
    const emptySubtitle = isFilteredCity ?
        'Try another city or come back later for fresh openings.' :
        'Try another city or refresh to fetch the latest availability.';

    return React.createElement(
        View, { style: { flex: 1 } },
        React.createElement(FilterBar, {
            options: cities,
            selected: selectedCity,
            onSelect: setSelectedCity,
            shiftCounts,
        }),
        React.createElement(SectionList, {
            sections: availableGroups,
            keyExtractor: (item) => item.id,
            extraData: { isBooking, bookingShiftId, now, bookedShifts },
            refreshControl: React.createElement(RefreshControl, {
                refreshing: isRefetching,
                onRefresh: refetch,
                tintColor: '#004FB4',
            }),
            contentContainerStyle: { paddingBottom: 24 },
            renderSectionHeader: ({ section: { title, shiftCount, totalHours } }) =>
                React.createElement(DateSection, {
                    title,
                    shiftCount,
                    totalHours,
                }),
            renderItem: ({ item: shift }) => {
                const started = shift.startTime < now;
                const overlapping = isOverlapping(shift);

                const isThisBooking = isBooking && bookingShiftId === shift.id;
                const isThisCanceling = isCanceling && cancelingShiftId === shift.id;
                // If it is currently being booked, it was unbooked when clicked, so treat as unbooked for UI
                // If it is currently being canceled, it was booked when clicked, so treat as booked for UI
                const apparentBooked = isThisBooking ? false : isThisCanceling ? true : shift.booked;

                return React.createElement(ShiftCard, {
                    shift,
                    actionLabel: apparentBooked ? 'Cancel' : 'Book',
                    actionVariant: apparentBooked ? 'danger' : 'success',
                    loading: isThisBooking || isThisCanceling,
                    disabled: false,
                    started,
                    overlapping,
                    onAction: () => apparentBooked ? cancelShift(shift.id) : bookShift(shift.id),
                });
            },
            ListEmptyComponent: React.createElement(EmptyState, {
                title: emptyTitle,
                subtitle: emptySubtitle,
            }),
        })
    );
}

const LoaderWrap = styled.View `
  flex: 1;
  align-items: center;
  justify-content: center;
`;

const LoaderText = styled.Text `
  margin-top: 12px;
  color: ${({ theme: { colors } }) => colors.muted};
  font-size: 14px;
`;