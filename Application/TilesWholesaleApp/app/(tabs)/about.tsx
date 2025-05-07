import React, { useEffect, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useCompanyStore } from "@/src/store/companyStore";
import { companyApi, initializeAppData } from "@/src/services/apiService";
import AboutUs from "@/src/components/company/AboutUs";

export default function AboutScreen() {
  const [loading, setLoading] = useState(true);

  const {
    companyInfo,
    setCompanyInfo,
    setLoading: setCompanyLoading,
    setError: setCompanyError,
  } = useCompanyStore();

  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);

        // Initialize sample data if needed
        await initializeAppData();

        // Load company info
        const companyResult = await companyApi.getCompanyInfo();
        if (companyResult.data) {
          setCompanyInfo(companyResult.data);
        } else if (companyResult.error) {
          setCompanyError(companyResult.error);
        }
      } catch (error) {
        console.error("Failed to load company data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading company information...</Text>
      </View>
    );
  }

  return <AboutUs />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8E8E93",
  },
});
