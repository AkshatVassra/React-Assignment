import React, { useMemo } from 'react';
import { ActivityIndicator, RefreshControl, SectionList, View } from 'react-native';
import styled from 'styled-components/native';

import { DateSection } from '../components/DateSection';
import { EmptyState } from '../components/EmptyState';
import { ShiftCard } from '../components/ShiftCard';
import { useCancelShift, useShifts } from '../api/queries';
import { groupShiftsByDate } from '../utils/groupByDate';

export function MyShiftsScreen() {
    const { data: shifts = [], isLoading, isError, error, isRefetching, refetch } = useShifts();
    const { mutate: cancelShift, isPending: isCanceling, variables: cancelingShiftId } = useCancelShift();

    const bookedGroups = useMemo(() => {
        const bookedShifts = shifts.filter((shift) => shift.booked);
        return groupShiftsByDate(bookedShifts);
    }, [shifts]);

    if (isLoading) {
        return React.createElement(
            LoaderWrap,
            null,
            React.createElement(ActivityIndicator, { size: 'large', color: '#004FB4' }),
            React.createElement(LoaderText, null, 'Loading booked shifts')
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
    const emptyTitle = 'No booked shifts yet';
    const emptySubtitle = 'Book a shift from the Available tab and it will appear here immediately.';

    return React.createElement(
        View, { style: { flex: 1 } },
        React.createElement(SectionList, {
            sections: bookedGroups,
            keyExtractor: (item) => item.id,
            extraData: { isCanceling, cancelingShiftId, now },
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

                const isThisCanceling = isCanceling && cancelingShiftId === shift.id;
                const apparentBooked = isThisCanceling ? false : shift.booked;

                return React.createElement(ShiftCard, {
                    shift,
                    actionLabel: 'Cancel',
                    actionVariant: 'danger',
                    loading: isThisCanceling,
                    disabled: false,
                    started,
                    onAction: () => cancelShift(shift.id),
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