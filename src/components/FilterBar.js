import React from 'react';
import styled from 'styled-components/native';

export function FilterBar({ options, selected, onSelect, shiftCounts }) {
    return ( <
        Wrapper > {
            options.map((option) => ( <
                Chip key = { option }
                active = { option === selected }
                onPress = {
                    () => onSelect(option) }
                style = {
                    ({ pressed }) => ({ opacity: pressed ? 0.72 : 1 }) } >
                <
                ChipLabel active = { option === selected } > { option === 'All' ? 'All' : `${option} (${shiftCounts[option] || 0})` } <
                /ChipLabel> <
                /Chip>
            ))
        } <
        /Wrapper>
    );
}

const Wrapper = styled.ScrollView.attrs({
    horizontal: true,
    showsHorizontalScrollIndicator: false,
    contentContainerStyle: { paddingHorizontal: 20 },
})
`
  background-color: transparent;
  padding-vertical: 16px;
  max-height: 70px;
`;

const Chip = styled.Pressable `
  margin-right: 24px;
  justify-content: center;
`;

const ChipLabel = styled.Text `
  color: ${({ theme: { colors }, active }) => active ? colors.primary : colors.muted};
  font-size: 16px;
  font-weight: ${({ active }) => active ? '700' : '500'};
`;