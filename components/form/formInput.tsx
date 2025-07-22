import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import "../../global.css";

interface FormProps{
    label:string,
    name:string,
    value:string,
    placeHolder:string,
    action:(text:string)=>void,
    error:string,
    icon:any
}


export const InputFields:React.FC<FormProps> = ({label, name, value, placeHolder, action, error, icon})=>{
    const [showPsw, setShowPsw] = useState<boolean>(true)

    return(
        <View className="flex-col gap-[5px] w-full">
            <View className="flex ">
                <Text className="text-[16px] font-[600] text-gray-800">{label}</Text>
            </View>

            <View className={`flex justify-between items-center flex-row bg-[#E9EAEB] min-h-14 p-4 py-1 text-black rounded-[7px]   ${error.trim()!=='' ? " border border-red-500 ":"border-none "} `}
>
               <View className="flex items-center justify-between flex-row gap-[8px]">
               {name && name !== "Phone Number" && <View className="">
                     <MaterialCommunityIcons
                       name={icon} 
                       size={15}
                     />    
                </View>}
                
                <TextInput
                  placeholder={placeHolder}
                  value={value}
                  secureTextEntry={name==="Password" && !showPsw}
                  onChangeText={action}
                  keyboardType="email-address"
                  className="w-full outline-none  border-none"
                />
                </View>
                {name === "Password" && 
                <TouchableOpacity
                  onPress={()=>{setShowPsw(!showPsw)}}
                  className=""
                  >
                   <MaterialCommunityIcons
                       name={showPsw ? 'eye': 'eye-off'} 
                       size={15}
                     />                   
                  </TouchableOpacity>
                }
            </View>
            <Text className="text-[10px] italic text-red-500 font-serif">{error}</Text>
        </View>
    )
}

interface FormProps{
    label:string,
    name:string,
    value:string,
    placeHolder:string,
    action:(text:string)=>void,
    error:string,
    icon:any
    style?:any
}

export const SearchInput = ({name, icon, value, error, placeHolder, action, style}:FormProps) =>{
  return(
        <View className={`flex justify-between ${style}  items-center flex-row bg-[#1F2A370D] min-h-14 p-4 py-1 text-black rounded-[7px] `}>
               <View className="flex-1 items-center justify-between flex-row gap-[8px]">
               <View className="">
                     <MaterialCommunityIcons
                       name={'magnify'} 
                       size={25}
                     />    
                </View>
                <TextInput
                  placeholder={'search'}
                  value={value}
                  onChangeText={action}
                  keyboardType="email-address"
                  className={`w-full outline-none  border-none`}
                />
                </View>
                <View className="flex">
                <TouchableOpacity className="flex-1 items-center justify-center ">
                   <MaterialCommunityIcons
                       name={'tune'} 
                       size={25}
                     />   
                </TouchableOpacity>

                </View>
            </View>

  )
}