import React from 'react';
import styled from 'styled-components/native';

export function DateSection({ title, shiftCount, totalHours }) {
    return (
        <Wrapper>
            <Title>{title}</Title>
            <SubLabel>
                {shiftCount} shift{shiftCount !== 1 ? 's' : ''}, {totalHours} h
            </SubLabel>
        </Wrapper>
    );
}

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: transparent;
  padding: 16px 20px 8px 24px;
`;

const Title = styled.Text`
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 18px;
  font-weight: 800;
  margin-right: 12px;
`;

const SubLabel = styled.Text`
  color: ${({ theme: { colors } }) => colors.secondary};
  font-size: 14px;
  font-weight: 500;
`;