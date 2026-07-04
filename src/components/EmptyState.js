import React from 'react';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

export function EmptyState({ title, subtitle }) {
    return ( <
        Wrapper >
        <
        GradientBlock colors = {
            ['#E2E8F0', '#F7F8FB'] }
        start = {
            { x: 0, y: 0 } }
        end = {
            { x: 1, y: 1 } } >
        <
        Illustration >
        <
        OrbLarge / >
        <
        OrbSmall / >
        <
        CoreRing / >
        <
        /Illustration> <
        Title > { title } < /Title> <
        Subtitle > { subtitle } < /Subtitle> <
        /GradientBlock> <
        /Wrapper>
    );
}

const Wrapper = styled.View `
  padding: 32px 16px;
  align-items: center;
  justify-content: center;
`;

const GradientBlock = styled(LinearGradient)
`
  padding: 40px 24px;
  border-radius: 20px;
  align-items: center;
  width: 100%;
`;

const Illustration = styled.View `
  width: 84px;
  height: 84px;
  margin-bottom: 16px;
  align-items: center;
  justify-content: center;
`;

const OrbLarge = styled.View `
  position: absolute;
  width: 84px;
  height: 84px;
  border-radius: 42px;
  background-color: rgba(0, 79, 180, 0.12);
`;

const OrbSmall = styled.View `
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 20px;
  background-color: rgba(226, 0, 106, 0.16);
  top: 10px;
  right: 8px;
`;

const CoreRing = styled.View `
  width: 26px;
  height: 26px;
  border-radius: 13px;
  border-width: 4px;
  border-color: rgba(0, 79, 180, 0.9);
  background-color: transparent;
`;

const Title = styled.Text `
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 20px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled.Text `
  color: ${({ theme: { colors } }) => colors.secondary};
  font-size: 15px;
  font-weight: 400;
  text-align: center;
  line-height: 22px;
`;