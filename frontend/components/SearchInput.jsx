import {useState} from "react";
import {router, usePathname} from "expo-router";
import {View, TouchableOpacity, Image, TextInput, Alert} from "react-native";

import {icons} from "../constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const SearchInput = ({initialQuery}) => {
    const pathname = usePathname();
    const [id, setId] = useState(initialQuery || "");

    return (
        <View
            className="flex flex-row items-center space-x-2 w-[95%] ml-auto mr-auto px-4 bg-[#CBF3F0] rounded-2xl border-2 border-black-200 focus:border-secondary">
            <TextInput
                className="text-base mt-0.5 text-black-200 flex-1 font-pregular"
                value={id}
                placeholder="Search a complaint by ID"
                placeholderTextColor="#6C757D"
                onChangeText={(e) => setId(e)}
            />

            <TouchableOpacity
                onPress={() => {
                    if (id === "")
                        return Alert.alert(
                            "Missing Id",
                            "Please input something to search results across database"
                        );
                    if (pathname.startsWith("/complaint")) router.setParams({id});
                    else router.push(`/complaint/${id}`);
                }}
            >
                {/*<Image source={icons.search} className="w-5 h-5 " resizeMode="contain"/>*/}
                <FontAwesome name="search" size={20} color="black" className="w-5 h-5"/>

            </TouchableOpacity>
        </View>
    );
};

export default SearchInput;