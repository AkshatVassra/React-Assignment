import React, { useRef } from 'react';
import { Animated, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';

const StyledPressable = styled.Pressable `
  min-width: 90px;
  align-items: center;
  justify-content: center;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: transparent;
  border-width: 1px;
  border-color: ${({ theme: { colors }, variant, disabled, loading }) => {
    if (loading) {
      return variant === 'danger' ? colors.dangerBorder : colors.successLight;
    }
    if (disabled) {
      return colors.disabled;
    }
    if (variant === 'danger') {
      return colors.dangerBorder;
    }
    return colors.success;
  }};
`;

const AnimatedPressable = Animated.createAnimatedComponent(StyledPressable);

import Svg, { G, Circle, Path } from 'react-native-svg';

const CustomSpinner = ({ variant }) => {
    const rotation = useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.loop(
            Animated.timing(rotation, {
                toValue: 1,
                duration: 1000,
                easing: require('react-native').Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, [rotation]);

    const rotate = rotation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    const color = variant === 'danger' ? '#E2006A' : '#16A64D';

    return (
        <Animated.View style={{ transform: [{ rotate }] }}>
            <Svg width="24" height="24" viewBox="0 0 38 38" stroke={color}>
                <G fill="none" fillRule="evenodd">
                    <G transform="translate(1 1)" strokeWidth="3">
                        <Circle strokeOpacity=".4" cx="18" cy="18" r="18" />
                        <Path d="M36 18c0-9.94-8.06-18-18-18" />
                    </G>
                </G>
            </Svg>
        </Animated.View>
    );
};

export function ActionButton({ variant, disabled, loading, onPress, children }) {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        if (disabled || loading) return;
        Animated.spring(scale, {
            toValue: 0.92,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        if (disabled || loading) return;
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
        }).start();
    };

    return ( <
        AnimatedPressable variant = { variant }
        disabled = { disabled }
        loading = { loading }
        onPress = { onPress }
        onPressIn = { handlePressIn }
        onPressOut = { handlePressOut }
        style = {
            ({ pressed }) => ({
                opacity: pressed && !disabled && !loading ? 0.78 : 1,
                transform: [{ scale }],
            })
        } >
        {
            loading ? ( <
                CustomSpinner variant={variant} />
            ) : (
                children
            )
        } <
        /AnimatedPressable>
    );
}

export const ActionButtonLabel = styled.Text `
  color: ${({ theme: { colors }, variant, disabled }) => {
    if (disabled) {
      return colors.disabled;
    }
    return variant === 'danger' ? colors.danger : colors.success;
  }};
  font-size: 14px;
  font-weight: 700;
`;