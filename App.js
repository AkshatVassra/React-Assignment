import React, { useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { ThemeProvider } from 'styled-components/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';

import { useUIStore } from './src/store/uiStore';
import { useShifts } from './src/api/queries';
import { AvailableShiftsScreen } from './src/screens/AvailableShiftsScreen';
import { MyShiftsScreen } from './src/screens/MyShiftsScreen';

const queryClient = new QueryClient();

const toastConfig = {
        error: ({ text1, text2 }) => ( <
            ToastCard >
            <
            ToastTitle > { text1 } < /ToastTitle> {
                text2 ? < ToastSubtitle > { text2 } < /ToastSubtitle> : null} <
                    /ToastCard>
            ),
        };

        const theme = {
            colors: {
                background: 'transparent',
                panel: '#FFFFFF',
                panelRaised: 'rgba(255, 255, 255, 0.7)',
                card: '#FFFFFF',
                primary: '#004FB4',
                secondary: '#4F6C92',
                danger: '#E2006A',
                dangerBorder: '#FE93B3',
                success: '#55CB82',
                successLight: '#CAEFD8',
                text: '#4F6C92',
                muted: '#A4B8D3',
                disabled: '#CBD2E1',
                line: '#CBD2E1',
                shadow: 'rgba(0, 0, 0, 0.05)',
            },
        };

        const AnimatedPressable = Animated.createAnimatedComponent(styled.Pressable `
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 16px;
`);

        function TabButton({ active, onPress, children }) {
            const scale = useRef(new Animated.Value(1)).current;

            const handlePressIn = () => {
                Animated.spring(scale, {
                    toValue: 0.95,
                    useNativeDriver: true,
                }).start();
            };

            const handlePressOut = () => {
                Animated.spring(scale, {
                    toValue: 1,
                    useNativeDriver: true,
                }).start();
            };

            return ( <
                AnimatedPressable active = { active }
                onPress = { onPress }
                onPressIn = { handlePressIn }
                onPressOut = { handlePressOut }
                style = {
                    ({ pressed }) => ({
                        opacity: pressed ? 0.82 : 1,
                        transform: [{ scale }],
                    })
                } >
                { children } <
                /AnimatedPressable>
            );
        }

        function AppShell() {
            const { activeTab, setActiveTab } = useUIStore();
            const insets = useSafeAreaInsets();

            return ( <
                Screen >
                <
                LinearGradient colors = {
                    ['#F7F8FB', '#E2E8F0'] }
                style = { StyleSheet.absoluteFillObject }
                />

                <
                ScreenCard > { activeTab === 'my' ? < MyShiftsScreen / > : < AvailableShiftsScreen / > } <
                /ScreenCard>

                <
                FloatingTabBarContainer style = {
                    { paddingBottom: Math.max(insets.bottom, 16) } } >
                <
                BlurView intensity = { 80 }
                tint = "light"
                style = { styles.blurContainer } >
                <
                TabButton active = { activeTab === 'my' }
                onPress = {
                    () => setActiveTab('my') } >
                <
                TabLabel active = { activeTab === 'my' } > My shifts < /TabLabel> <
                /TabButton> <
                TabButton active = { activeTab === 'available' }
                onPress = {
                    () => setActiveTab('available') } >
                <
                TabLabel active = { activeTab === 'available' } > Available shifts < /TabLabel> <
                /TabButton> <
                /BlurView> <
                /FloatingTabBarContainer> <
                /Screen>
            );
        }

        export default function App() {
            return ( <
                QueryClientProvider client = { queryClient } >
                <
                ThemeProvider theme = { theme } >
                <
                SafeAreaProvider >
                <
                StatusBar style = "dark" / >
                <
                AppShell / >
                <
                Toast config = { toastConfig }
                position = "bottom"
                bottomOffset = { 18 }
                /> <
                /SafeAreaProvider> <
                /ThemeProvider> <
                /QueryClientProvider>
            );
        }

        const styles = StyleSheet.create({
            blurContainer: {
                flexDirection: 'row',
                borderRadius: 30,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.4)',
            },
        });

        const Screen = styled.View `
  flex: 1;
`;

        const ScreenCard = styled.View `
  flex: 1;
`;

        const FloatingTabBarContainer = styled.View `
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding-horizontal: 24px;
`;

        const TabLabel = styled.Text `
  color: ${({ theme: { colors }, active }) => active ? colors.primary : colors.muted};
  font-size: 16px;
  font-weight: 600;
`;

        const ToastCard = styled.View `
    background-color: #b42318;
    padding: 14px 16px;
    border-radius: 16px;
    margin-horizontal: 16px;
    margin-bottom: 8px;
    border-width: 1px;
    border-color: rgba(255, 255, 255, 0.14);
`;

        const ToastTitle = styled.Text `
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
`;

        const ToastSubtitle = styled.Text `
    color: rgba(255, 255, 255, 0.92);
    font-size: 13px;
    margin-top: 4px;
`;