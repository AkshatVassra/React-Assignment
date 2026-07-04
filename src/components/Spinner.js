import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { SvgXml } from 'react-native-svg';

const greenSpinnerXml = `
<svg width="24" height="24" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#16A64D">
    <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)" stroke-width="3">
            <circle stroke-opacity=".3" cx="18" cy="18" r="18"/>
            <path d="M36 18c0-9.94-8.06-18-18-18" />
        </g>
    </g>
</svg>
`;

const redSpinnerXml = `
<svg width="24" height="24" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" stroke="#E2006A">
    <g fill="none" fill-rule="evenodd">
        <g transform="translate(1 1)" stroke-width="3">
            <circle stroke-opacity=".3" cx="18" cy="18" r="18"/>
            <path d="M36 18c0-9.94-8.06-18-18-18" />
        </g>
    </g>
</svg>
`;

export function CustomSpinner({ variant = 'success' }) {
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(spinValue, {
                toValue: 1,
                duration: 800,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();
    }, [spinValue]);

    const spin = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <SvgXml xml={variant === 'danger' ? redSpinnerXml : greenSpinnerXml} />
        </Animated.View>
    );
}
