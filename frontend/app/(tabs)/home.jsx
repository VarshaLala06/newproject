import React, {useEffect, useState} from 'react';
import {FlatList, ImageBackground, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {fetchPendingComplaints} from '../../lib/api';
import SearchInput from "../../components/SearchInput";
import {images} from "../../constants";
import {useGlobalContext} from "../../context/GlobalProvider";

const Home = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [pendingComplaints, setPendingComplaints] = useState([]);
    const router = useRouter();
    const {user} = useGlobalContext();

    useEffect(() => {
        const getPendingComplaints = async () => {
            try {
                const complaintsData = await fetchPendingComplaints();
                setPendingComplaints(complaintsData);
            } catch (error) {
                console.error('Error fetching pending complaints:', error);
            }
        };

        getPendingComplaints();
    }, []);

    const handleComplaintPress = (complaintId) => {
        router.push(`/complaint/${complaintId}`);
    };

    const renderComplaintItem = ({item}) => (
        <TouchableOpacity onPress={() => handleComplaintPress(item.complaint_id)}>
            <View className="bg-gray-200 p-4 mb-2 mt-2 rounded w-full">
                <Text className="text-lg">{item.newspaper_name}</Text>
                <Text>{item.issue_description}</Text>
            </View>
        </TouchableOpacity>
    );

    if (userDetails) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-primary">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <ImageBackground source={images.emblem} resizeMode="contain" className="flex-1 justify-center items-center">
            {/* Add an overlay to reduce the image opacity */}
            <View className="absolute top-0 left-0 w-full h-full bg-white/80"/>

            <SafeAreaView className="flex-1 w-full px-4">
                <Text className="text-3xl text-center font-pbold p-4 mb-10">Welcome {"\n"} {user.user_name} </Text>

                <SearchInput/>
                <Text className="text-3xl font-pbold p-4 mt-10">Pending Complaints</Text>
                <FlatList
                    data={pendingComplaints}
                    renderItem={renderComplaintItem}
                    keyExtractor={(item) => item.complaint_id.toString()}
                    contentContainerStyle={{justifyContent: 'center', alignItems: 'left'}}
                    style={{width: '100%'}}
                />
            </SafeAreaView>
        </ImageBackground>
    );
};

export default Home;