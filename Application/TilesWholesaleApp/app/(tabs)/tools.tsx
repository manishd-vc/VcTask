import LanguageSelector from "@/src/components/common/LanguageSelector";
import DealerLocator from "@/src/components/company/DealerLocator";
import InstallationCalculator from "@/src/components/product/InstallationCalculator";
import TileComparisonTool from "@/src/components/product/TileComparisonTool";
import { useLocalizationStore } from "@/src/store/localizationStore";
import { useProductStore } from "@/src/store/productStore";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ToolsScreen() {
  const [showComparisonTool, setShowComparisonTool] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showDealerLocator, setShowDealerLocator] = useState(false);
  const navigation = useNavigation();

  const { t } = useLocalizationStore();
  const { products } = useProductStore();

  // Get available sizes from products for the calculator
  const availableSizes = products
    .flatMap((product) => product.sizes)
    .filter(
      (size, index, self) =>
        index ===
        self.findIndex(
          (s) => s.width === size.width && s.height === size.height
        )
    );

  const tools = [
    {
      id: "comparison",
      name: "Tile Comparison Tool",
      description: "Compare up to 4 tiles side by side",
      icon: "https://cdn-icons-png.flaticon.com/128/4222/4222019.png",
      action: () => setShowComparisonTool(true),
    },
    {
      id: "calculator",
      name: "Installation Calculator",
      description: "Calculate how many tiles you need",
      icon: "https://cdn-icons-png.flaticon.com/128/4341/4341093.png",
      action: () => setShowCalculator(true),
    },
    {
      id: "dealer",
      name: "Find a Dealer",
      description: "Locate authorized dealers near you",
      icon: "https://cdn-icons-png.flaticon.com/128/3177/3177361.png",
      action: () => setShowDealerLocator(true),
    },
    {
      id: "language",
      name: "Language Settings",
      description: "Change app language preferences",
      icon: "https://cdn-icons-png.flaticon.com/128/484/484582.png",
      action: () => {},
      component: (
        <LanguageSelector modalTitle="Select Your Preferred Language" />
      ),
    },
  ];

  const handleContactPress = () => {
    // @ts-ignore - we'll set up proper typing for navigation later
    navigation.navigate("contact");
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Tools & Utilities</Text>
          <Text style={styles.subtitle}>
            Helpful tools to assist with your tile selection and installation
          </Text>
        </View>

        <View style={styles.toolsGrid}>
          {tools.map((tool) => (
            <TouchableOpacity
              key={tool.id}
              style={styles.toolCard}
              onPress={tool.action}
            >
              <Image source={{ uri: tool.icon }} style={styles.toolIcon} />
              <Text style={styles.toolName}>{tool.name}</Text>
              <Text style={styles.toolDescription}>{tool.description}</Text>
              {tool.component}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Need Professional Help?</Text>
          <Text style={styles.infoText}>
            Contact our experts for personalized assistance with selection,
            measurement, or installation advice.
          </Text>
          <TouchableOpacity
            style={styles.infoButton}
            onPress={handleContactPress}
          >
            <Text style={styles.infoButtonText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Tool Modals */}
      <TileComparisonTool
        isVisible={showComparisonTool}
        onClose={() => setShowComparisonTool(false)}
      />

      <InstallationCalculator
        isVisible={showCalculator}
        onClose={() => setShowCalculator(false)}
        availableSizes={availableSizes}
      />

      {/* Using Modal for dealer locator to avoid map rendering issues */}
      <Modal
        visible={showDealerLocator}
        animationType="slide"
        onRequestClose={() => setShowDealerLocator(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Find a Dealer</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowDealerLocator(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          <DealerLocator />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  toolsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  toolCard: {
    width: "46%",
    margin: "2%",
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  toolIcon: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  toolName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  infoCard: {
    margin: 16,
    padding: 16,
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BDE0FE",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  infoButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  infoButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 16,
    color: "#333",
  },
});
