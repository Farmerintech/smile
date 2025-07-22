import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

interface MPROPS {
  visible: boolean;
  source:any,
  price:number,
  onRequestClose: () => void;
}

const { height } = Dimensions.get("window");
const itemPrice = 1500;

export const CartModal = ({ visible, onRequestClose, source, price }: MPROPS) => {
  const [count, setCount] = useState(0)
  const add = () =>{
    setCount(count+1);
  }
  const reduce = () =>{
    setCount(count-1);
    if(count <2){
      setCount(1)
    }
  }
  const itemPrice = (price:number)=>{
    return price * count
  }
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalSheet}>
              {/* Image with close icon */}
              <View style={styles.imageWrapper}>
                <Image
                  source={source}
                  style={styles.image}
                />
                <TouchableOpacity
                  onPress={onRequestClose}
                  className="bg-white w-[40px] h-[40px] rounded-full absolute top-5 right-5 flex justify-center items-center"
                >
                  <Text style={styles.closeIconText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Content */}
              <View style={styles.content}>
                <Text style={styles.title}>Chicken</Text>
                <Text style={styles.subtitle}>₦{price} | 12 mins</Text>

                {/* Buttons */}
                <View style={styles.buttonRow}>
                  {/* Border only button with + and - */}
                  <TouchableOpacity style={styles.quantityButton}>
                    <Text style={styles.icon} onPress={reduce}>−</Text>
                    <Text style={styles.quantityText} >{count}</Text>
                    <Text style={styles.icon} onPress={add}>+</Text>
                  </TouchableOpacity>

                  {/* Filled orange button */}
                  <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>Add ₦{itemPrice(price)}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "white",
    height: height * 0.6,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: "hidden",
  },
  imageWrapper: {
    position: "relative",
    width: "100%",
    height: 250,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  closeIcon: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "white",
    borderRadius: 50,
    padding: 16,
    zIndex: 10,
    elevation: 4,
  },
  closeIconText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  quantityButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#FF7A00",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF7A00",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  addButton: {
    flex: 1,
    backgroundColor: "#FF6347",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
