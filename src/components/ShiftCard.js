import React from 'react';
import styled from 'styled-components/native';

import { ActionButton, ActionButtonLabel } from './Button';
import { formatShiftTime } from '../utils/date';

export function ShiftCard({
    shift,
    actionLabel,
    onAction,
    actionVariant = 'primary',
    disabled = false,
    loading = false,
    overlapping = false,
    started = false,
}) {
    return (
        <Card>
            <InfoContainer>
                <ShiftTime>{formatShiftTime(shift.startTime, shift.endTime)}</ShiftTime>
                <AreaText>{shift.area}</AreaText>
            </InfoContainer>

            <StatusContainer>
                {shift.booked ? (
                    <StatusText variant="primary">Booked</StatusText>
                ) : overlapping ? (
                    <StatusText variant="danger">Overlapping</StatusText>
                ) : null}
            </StatusContainer>

            <ActionContainer>
                <ActionButton
                    variant={actionVariant}
                    disabled={disabled || started || overlapping}
                    loading={loading}
                    onPress={onAction}
                >
                    {!loading && (
                        <ActionButtonLabel variant={actionVariant} disabled={disabled || started || overlapping}>
                            {actionLabel}
                        </ActionButtonLabel>
                    )}
                </ActionButton>
            </ActionContainer>
        </Card>
    );
}

const Card = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px 20px;
  background-color: ${({ theme: { colors } }) => colors.card};
  border-radius: 12px;
  margin-horizontal: 16px;
  margin-vertical: 8px;
  elevation: 2;
  shadow-color: ${({ theme: { colors } }) => colors.primary};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.05;
  shadow-radius: 10px;
`;

const InfoContainer = styled.View`
  flex: 1;
`;

const ShiftTime = styled.Text`
  color: ${({ theme: { colors } }) => colors.secondary};
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
`;

const AreaText = styled.Text`
  color: ${({ theme: { colors } }) => colors.muted};
  font-size: 14px;
  font-weight: 400;
`;

const StatusContainer = styled.View`
  flex: 1;
  align-items: center;
`;

const StatusText = styled.Text`
  color: ${({ theme: { colors }, variant }) => variant === 'danger' ? colors.danger : colors.primary};
  font-size: 14px;
  font-weight: 700;
`;

const ActionContainer = styled.View`
  flex: 1;
  align-items: flex-end;
`;