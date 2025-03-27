import {useEffect} from "react";
import {useFonts} from "expo-font";
import {SplashScreen, Stack} from "expo-router";
import GlobalProvider from "../context/GlobalProvider";
import Notification from "./Notification";
import * as Linking from 'expo-linking';


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const prefix = Linking.createURL('/');

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
        "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
        "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
        "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
        "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
        "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
        "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
        "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
        "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
    });

    useEffect(() => {
        if (error) throw error;

        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, error]);

    if (!fontsLoaded) {
        return null;
    }

    if (!fontsLoaded && !error) {
        return null;
    }

    return (
        <GlobalProvider>
            <Notification/>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="(tabs)"
            >
                <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                <Stack.Screen name="(auth)" options={{headerShown: false}}/>
                <Stack.Screen name="index" options={{headerShown: false}}/>
                <Stack.Screen name="complaint/[id]" options={{headerShown: false}}/>
            </Stack>
        </GlobalProvider>
    );
};

export default RootLayout;