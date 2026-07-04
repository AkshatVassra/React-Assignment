import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import { fetchShifts, bookShift, cancelShift } from './shiftApi';
import Toast from 'react-native-toast-message';

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const useShifts = () => {
    return useQuery({
        queryKey: ['shifts'],
        queryFn: fetchShifts,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retry: 1,
        onError: (err) => {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Network error. Could not load shifts.',
                text2: err.message || 'Please try again.',
            });
        },
    });
};

export const useBookShift = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bookShift,
        onMutate: async(shiftId) => {
            await queryClient.cancelQueries({ queryKey: ['shifts'] });
            const previousShifts = queryClient.getQueryData(['shifts']);
            if (previousShifts) {
                queryClient.setQueryData(['shifts'], (old) =>
                    old.map((shift) => (shift.id === shiftId ? {...shift, booked: true } : shift))
                );
            }
            return { previousShifts };
        },
        onSuccess: (updatedShift) => {
            if (!updatedShift) return;
            queryClient.setQueryData(['shifts'], (old = []) =>
                old.map((shift) => (shift.id === updatedShift.id ? updatedShift : shift))
            );
        },
        onError: (err, shiftId, context) => {
            if (context?.previousShifts) {
                queryClient.setQueryData(['shifts'], context.previousShifts);
            }
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Failed to book shift',
                text2: err.message || 'Something went wrong.',
            });
        },
    });
};

export const useCancelShift = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelShift,
        onMutate: async(shiftId) => {
            await queryClient.cancelQueries({ queryKey: ['shifts'] });
            const previousShifts = queryClient.getQueryData(['shifts']);
            if (previousShifts) {
                queryClient.setQueryData(['shifts'], (old) =>
                    old.map((shift) => (shift.id === shiftId ? {...shift, booked: false } : shift))
                );
            }
            return { previousShifts };
        },
        onSuccess: (updatedShift) => {
            if (!updatedShift) return;
            queryClient.setQueryData(['shifts'], (old = []) =>
                old.map((shift) => (shift.id === updatedShift.id ? updatedShift : shift))
            );
        },
        onError: (err, shiftId, context) => {
            if (context?.previousShifts) {
                queryClient.setQueryData(['shifts'], context.previousShifts);
            }
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Failed to cancel shift',
                text2: err.message || 'Something went wrong.',
            });
        },
    });
};