import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import { Language, useLocalizationStore } from "../../store/localizationStore";

interface LanguageOption {
  code: Language;
  name: string;
  localName: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", localName: "English" },
  { code: "hi", name: "Hindi", localName: "हिन्दी" },
  { code: "gu", name: "Gujarati", localName: "ગુજરાતી" },
];

interface LanguageSelectorProps {
  buttonStyle?: object;
  buttonTextStyle?: object;
  modalTitle?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  buttonStyle,
  buttonTextStyle,
  modalTitle = "Select Language",
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { currentLanguage, changeLanguage, t } = useLocalizationStore();

  const currentLanguageOption = LANGUAGES.find(
    (lang) => lang.code === currentLanguage
  );

  const handleLanguageChange = async (language: Language) => {
    try {
      await changeLanguage(language);
      setModalVisible(false);
    } catch (error) {
      Alert.alert("Error", "Failed to change language. Please try again.");
    }
  };

  const renderLanguageItem = ({ item }: { item: LanguageOption }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        currentLanguage === item.code && styles.selectedLanguageItem,
      ]}
      onPress={() => handleLanguageChange(item.code)}
    >
      <View style={styles.languageInfo}>
        <Text style={styles.languageName}>{item.name}</Text>
        <Text style={styles.languageLocalName}>{item.localName}</Text>
      </View>
      {currentLanguage === item.code && (
        <View style={styles.selectedIndicator} />
      )}
    </TouchableOpacity>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.languageButton, buttonStyle]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={[styles.languageButtonText, buttonTextStyle]}>
          {currentLanguageOption?.localName || "English"}
        </Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{modalTitle}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={LANGUAGES}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              contentContainerStyle={styles.languageList}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
  },
  languageButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
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
    padding: 4,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#8E8E93",
  },
  languageList: {
    paddingHorizontal: 16,
  },
  languageItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  selectedLanguageItem: {
    backgroundColor: "#F0F8FF",
  },
  languageInfo: {
    flex: 1,
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  languageLocalName: {
    fontSize: 14,
    color: "#8E8E93",
  },
  selectedIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#007AFF",
  },
});

export default LanguageSelector;
