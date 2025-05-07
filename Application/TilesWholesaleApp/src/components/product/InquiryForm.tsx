import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { inquiryApi } from "../../services/apiService";
import { Product } from "../../types";

interface InquiryFormProps {
  product?: Product;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ product }) => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    product
      ? `I'm interested in ${product.name}. Please provide more information.`
      : ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return false;
    }

    if (!phone.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return false;
    }

    if (phone.trim().length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return false;
    }

    if (email.trim() && !email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address");
      return false;
    }

    if (!message.trim()) {
      Alert.alert("Error", "Please enter your message");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await inquiryApi.submitInquiry({
        name,
        email,
        phone,
        message,
        productId: product?.id,
      });

      if (result.data) {
        Alert.alert(
          "Success",
          "Your inquiry has been submitted successfully. Our team will contact you soon.",
          [
            {
              text: "OK",
              onPress: () => {
                // @ts-ignore - will set up proper typing for navigation later
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "Error",
          result.error || "Failed to submit inquiry. Please try again."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Send Inquiry</Text>
        {product && (
          <View style={styles.productInfo}>
            <Text style={styles.productTitle}>{product.name}</Text>
            <Text style={styles.productType}>{product.tileType}</Text>
          </View>
        )}

        <View style={styles.formField}>
          <Text style={styles.label}>
            Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Your full name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>
            Phone <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.formField}>
          <Text style={styles.label}>
            Message <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.messageInput}
            placeholder="Enter your message or specific requirements"
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Inquiry</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By submitting this form, you agree to be contacted by our team
          regarding your inquiry.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  contentContainer: {
    padding: 16,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  productInfo: {
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productType: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },
  formField: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  required: {
    color: "#FF3B30",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  messageInput: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  disclaimer: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 16,
    textAlign: "center",
  },
});

export default InquiryForm;
