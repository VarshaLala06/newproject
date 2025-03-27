import React from 'react';
import {View, Text} from 'react-native';

const ComplaintTextField = ({label, value, extraStyles}) => {
    return (
        <View className={`flex flex-row items-baseline mt-2 ${extraStyles}`}>
            <Text className="text-base font-pbold">{label}:</Text>
            <Text className="text-base font-pregular ml-2 flex-shrink flex-grow">{value}</Text>
        </View>
    );
};

export default ComplaintTextField;