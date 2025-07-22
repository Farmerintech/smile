import CountrySelectWithInput from "@/components/countries"
import { FormDatePicker } from "@/components/form/datePicker"
import FilePicker from "@/components/form/filePicker"
import { InputFields } from "@/components/form/formInput"
import { SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"

 const Profile = () =>{
    return(
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor={"white"} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingTop: 10, paddingBottom:100, paddingHorizontal:16, backgroundColor:"white" }}>
                <View className="">
                <View className="flex items-center justify-center">
                    <TouchableOpacity className="bg-[#1F2A370D] w-[200px] h-[200px] rounded-full">
                        <FilePicker/>
                    </TouchableOpacity>
                </View>                            
            <View className="flex flex-col gap-[12px] w-full py-12 ">
          <CountrySelectWithInput
            value={''}
            onChange={() => {}}
            error={''}
          />
                <InputFields
                label="Email"
                placeHolder=""
                value={''}
                action={(text) => {}}
                name="Email"
                error={''}
                icon="account"
              />     
                <InputFields
                label="First Name"
                placeHolder=""
                value={''}
                action={(text) => {}}
                name="FirstName"
                error={''}
                icon="account"
              />     
               <InputFields
                label="Last Name"
                placeHolder=""
                value={''}
                action={(text) => {}}
                name="LastName"
                error={''}
                icon="account"
              />    
                        <View className="flex-row gap-[12px] w-full">
                          <View className="flex-1">
                            <FormDatePicker
                              label="Date of Birth"
                              icon="calendar"
                              error={ ""}
                              value={null}
                              onChange={(date: Date) => {}}
                            />
                          </View>
                        </View>
                           <TouchableOpacity
                             className="w-full bg-[#FF6347] py-[12px] rounded-[8px] mt-2 "
                             onPress={()=>{}}
                           >
                             <Text className="text-white text-center font-semibold text-base">
                               Save
                             </Text>
                           </TouchableOpacity>
                          
              </View>
              </View>
            </ScrollView>
            </SafeAreaView>
      
    )
}
export default Profile

