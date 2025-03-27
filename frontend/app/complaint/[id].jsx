import React, {useEffect, useState} from "react";
import {
    Alert,
    Button,
    ImageBackground,
    Linking,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {Picker} from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as DocumentPicker from "expo-document-picker";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {fetchComplaintDetails, submitResolutionDetails, uploadFiles} from '../../lib/api';
import ComplaintTextField from "../../components/ComplaintTextField";
import CustomButton from "../../components/CustomButton";
import {useRouter, useLocalSearchParams, router} from 'expo-router';
import {images} from "../../constants";

const Complaint = () => {
    const [complaintDetails, setComplaintDetails] = useState(null);
    const [status, setStatus] = useState("In Progress");
    const [actionDescription, setActionDescription] = useState("");
    const [resolutionDate, setResolutionDate] = useState(new Date());
    const [resolutionProofs, setResolutionProofs] = useState([]);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const {id} = useLocalSearchParams();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await fetchComplaintDetails(id); // Replace with actual complaint ID
                setComplaintDetails(data);
            } catch (error) {
                console.error("Error fetching complaint details:", error);
            }
        };

        fetchDetails();
    }, []);

    const handleAttachmentPress = () => {
        const url = 'https://outgoing-troll-neatly.ngrok-free.app/uploads/1742792987026_IMG-20250322-WA0003.jpg';

        // Debugging log
        console.log("Button pressed, attempting to open URL:", url);

        Linking.openURL(url)
            .catch(err => {
                console.error("Failed to open URL:", err);
                Alert.alert("Error", "Failed to open URL. Please try again later.");
            });
    };

    const handleFileUpload = async () => {
        const result = await DocumentPicker.getDocumentAsync({
            type: ["*/*", "image/*", "video/*"],
            multiple: true, // Enable multiple file selection
        });

        if (!result.cancelled) {
            const formData = new FormData();

            for (const doc of result.assets) {
                formData.append('files', {
                    uri: doc.uri,
                    name: doc.name,
                    type: doc.mimeType,
                });
            }

            try {
                const uploadedFiles = await uploadFiles(formData);
                setResolutionProofs([...resolutionProofs, ...uploadedFiles]);
                Alert.alert("Success", "Files uploaded successfully");
            } catch (error) {
                Alert.alert("Error", "Failed to upload files");
            }
        } else {
            Alert.alert("Error", "Please select a valid file");
        }
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || resolutionDate;
        setShowDatePicker(false);
        setResolutionDate(currentDate);
    };

    const handleSubmit = () => {
        if (!complaintDetails || !status || !actionDescription || !resolutionDate) {
            Alert.alert("Error", "Please fill in all the mandatory fields.");
            return;
        }

        const resolutionData = {
            complaint_id: complaintDetails.complaint_id,
            status,
            action_taken: actionDescription,
            resolution_date: resolutionDate,
            resolution_proof_path: resolutionProofs.map(proof => proof.url),
        };

        submitResolutionDetails(resolutionData)
            .then(() => {
                Alert.alert("Success", "Resolution details submitted successfully");
                router.push("/home")
            })
            .catch(error => {
                Alert.alert("Error", "Failed to submit resolution details");
            });
    };

    if (!complaintDetails) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center bg-primary">
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <ImageBackground source={images.flag}
                         resizeMode="cover"
                         className="flex-1 justify-center items-center">
            {/* Add an overlay to reduce the image opacity */}
            <View className="absolute top-0 left-0 w-full h-full bg-white/60"/>

            <SafeAreaView className="h-full w-full flex justify-center items-center px-4">
                <ScrollView className="w-full">
                    <View className="mb-4 mt-2 rounded-lg shadow-lg border-2 border p-2">
                        <Text
                            className="text-3xl text-center mt-3 mb-1 font-pextrabold p-2 text-black-700 ">Complaint
                            Details</Text>
                        <ComplaintTextField label='Complaint ID' value={complaintDetails.complaint_id}/>
                        <ComplaintTextField label='Created Date'
                                            value={new Date(complaintDetails.created_at).toLocaleDateString()}/>
                        <ComplaintTextField label='Newspaper Name' value={complaintDetails.newspaper_name}/>
                        <ComplaintTextField label='Published Date'
                                            value={new Date(complaintDetails.publication_date).toLocaleDateString()}/>
                        <ComplaintTextField label='Issue Category' value={complaintDetails.issue_category}/>
                        <ComplaintTextField label='Issue Description' value={complaintDetails.issue_description}/>
                        <View className="flex flex-row items-center mt-2 mb-1">
                            <Text className="text-base font-pbold">View File: </Text>
                            <CustomButton title="Newspaper Clipping" handlePress={handleAttachmentPress}
                                          containerStyles="ml-3 p-2"/>
                        </View>
                        <ComplaintTextField label='Deadline for Resolution' value={complaintDetails.deadline_dt}/>
                    </View>

                    <View className="mb-4">
                        <Text className="text-4xl text-center mt-2 font-pextrabold">Resolution</Text>
                        <View className="flex flex-row items-center mt-2 mb-4">
                            <Text className="text-base font-pbold mr-3"><Text
                                className="font-pbold text-red-600">*</Text>Status:</Text>
                            <View className="border w-[170px] h-7 justify-center">
                                <Picker
                                    selectedValue={status}
                                    onValueChange={(itemValue) => setStatus(itemValue)}
                                    itemStyle={{height: 40, fontSize: 16}}
                                >
                                    <Picker.Item label="In Progress" value="In Progress"/>
                                    <Picker.Item label="Pending" value="Pending"/>
                                    <Picker.Item label="Resolved" value="Resolved"/>
                                </Picker>
                            </View>
                        </View>

                        <Text className="text-base font-pbold justify-center"><Text
                            className="font-pbold text-red-600 mr-1">*</Text>Action
                            Taken Description:</Text>
                        <View className="flex flex-row items-center mb-2">
                            <View className="border border-gray-300 rounded-md flex-1 max-h-40">
                                <TextInput
                                    placeholder="Action Taken Description"
                                    value={actionDescription}
                                    onChangeText={setActionDescription}
                                    multiline
                                    textAlignVertical="top"
                                    className="p-2 h-[65]" // Increased height
                                    scrollEnabled
                                />
                            </View>
                        </View>

                        <Text className=" text-base font-pbold"><Text className="font-pbold text-red-600 mr-1">*</Text>Resolution
                            Date:</Text>
                        <View className="mb-4">
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                className="flex flex-row items-center border border-gray-300 rounded-md p-2 mt-2"
                            >
                                <Text
                                    className="flex-grow">{resolutionDate ? resolutionDate.toLocaleDateString() : "Select Date"}</Text>
                                <FontAwesome name="calendar" size={24} color="black"/>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={resolutionDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateChange}
                                />
                            )}
                        </View>

                        <View className="mb-4">
                            <Text className="text-base font-pbold mt-2"><Text
                                className="font-pbold text-red-600 mr-1">*</Text>Attachments:</Text>
                            <TouchableOpacity
                                onPress={handleFileUpload}
                                className="flex flex-row items-center border border-gray-300 rounded-md p-2 mt-2"
                            >
                                <FontAwesome name="paperclip" size={24} color="black"/>
                                <Text className="ml-2">Upload Resolution Proofs</Text>
                            </TouchableOpacity>
                            {resolutionProofs.length > 0 && (
                                <View className="mt-2 mb-4">
                                    {resolutionProofs.map((proof, index) => (
                                        <Text key={index} className="font-pregular">Uploaded File: {proof.name}</Text>
                                    ))}
                                </View>
                            )}
                        </View>

                        <CustomButton title="Submit" handlePress={handleSubmit}
                                      containerStyles="bg-blue-600 w-[100%] items-center ml-auto mr-auto"/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
};

export default Complaint;