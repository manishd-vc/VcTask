import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useCompanyStore } from "../../store/companyStore";

const AboutUs: React.FC = () => {
  const { companyInfo } = useCompanyStore();

  if (!companyInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading company information...</Text>
      </View>
    );
  }

  const handleContactPress = (type: "phone" | "email" | "whatsapp") => {
    if (!companyInfo) return;

    switch (type) {
      case "phone":
        Linking.openURL(`tel:${companyInfo.contactInfo.phone}`);
        break;
      case "email":
        Linking.openURL(`mailto:${companyInfo.contactInfo.email}`);
        break;
      case "whatsapp":
        Linking.openURL(
          `whatsapp://send?phone=${companyInfo.contactInfo.whatsapp}`
        );
        break;
    }
  };

  const handleSocialMedia = (
    platform: "facebook" | "instagram" | "twitter" | "linkedin"
  ) => {
    if (!companyInfo) return;

    const url = companyInfo.contactInfo.socialMedia[platform];
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Company Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: companyInfo.logo }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.companyName}>{companyInfo.name}</Text>
        <Text style={styles.tagline}>{companyInfo.tagline}</Text>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Us</Text>
        <Text style={styles.description}>{companyInfo.description}</Text>
      </View>

      {/* History Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our History</Text>
        <Text style={styles.description}>{companyInfo.history}</Text>
      </View>

      {/* Values Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Values</Text>
        {companyInfo.values.map((value, index) => (
          <View key={index} style={styles.valueItem}>
            <View style={styles.bulletPoint} />
            <Text style={styles.valueText}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Advantages Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose Us</Text>
        {companyInfo.advantages.map((advantage, index) => (
          <View key={index} style={styles.advantageItem}>
            <Text style={styles.advantageNumber}>{index + 1}</Text>
            <Text style={styles.advantageText}>{advantage}</Text>
          </View>
        ))}
      </View>

      {/* Contact Section */}
      <View style={styles.contactSection}>
        <Text style={styles.sectionTitle}>Get In Touch</Text>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress("phone")}
        >
          <Text style={styles.contactLabel}>Phone:</Text>
          <Text style={styles.contactValue}>
            {companyInfo.contactInfo.phone}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress("email")}
        >
          <Text style={styles.contactLabel}>Email:</Text>
          <Text style={styles.contactValue}>
            {companyInfo.contactInfo.email}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.contactItem}
          onPress={() => handleContactPress("whatsapp")}
        >
          <Text style={styles.contactLabel}>WhatsApp:</Text>
          <Text style={styles.contactValue}>
            {companyInfo.contactInfo.whatsapp}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactItem}>
          <Text style={styles.contactLabel}>Website:</Text>
          <Text style={styles.contactValue}>
            {companyInfo.contactInfo.website}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Social Media */}
      <View style={styles.socialSection}>
        <Text style={styles.socialTitle}>Follow Us</Text>
        <View style={styles.socialButtons}>
          {companyInfo.contactInfo.socialMedia.facebook && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMedia("facebook")}
            >
              <Text style={styles.socialButtonText}>Facebook</Text>
            </TouchableOpacity>
          )}

          {companyInfo.contactInfo.socialMedia.instagram && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMedia("instagram")}
            >
              <Text style={styles.socialButtonText}>Instagram</Text>
            </TouchableOpacity>
          )}

          {companyInfo.contactInfo.socialMedia.twitter && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMedia("twitter")}
            >
              <Text style={styles.socialButtonText}>Twitter</Text>
            </TouchableOpacity>
          )}

          {companyInfo.contactInfo.socialMedia.linkedin && (
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialMedia("linkedin")}
            >
              <Text style={styles.socialButtonText}>LinkedIn</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  header: {
    padding: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
  },
  valueItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
    marginRight: 12,
  },
  valueText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  advantageItem: {
    flexDirection: "row",
    marginBottom: 12,
  },
  advantageNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 24,
    marginRight: 12,
    fontSize: 14,
    fontWeight: "600",
    overflow: "hidden",
  },
  advantageText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
    lineHeight: 22,
  },
  contactSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  contactLabel: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  contactValue: {
    fontSize: 15,
    color: "#007AFF",
  },
  socialSection: {
    padding: 16,
    marginBottom: 24,
  },
  socialTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  socialButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  socialButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    margin: 8,
  },
  socialButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default AboutUs;
