import { SafeAreaView, ScrollView, StatusBar } from "react-native"
 const Order = () =>{
    return(
          <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" backgroundColor={"white"} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingTop: 10, paddingBottom:100, paddingHorizontal:16, backgroundColor:"white" }}>
        </ScrollView>
        </SafeAreaView>
    )
}
export default Order

