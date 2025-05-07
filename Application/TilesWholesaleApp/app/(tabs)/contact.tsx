import StoreLocation from "@/src/components/company/StoreLocation";
import { companyApi } from "@/src/services/apiService";
import { useCompanyStore } from "@/src/store/companyStore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function ContactScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(null);

        // Load company info
        const companyResult = await companyApi.getCompanyInfo();
        if (companyResult.data) {
          setCompanyInfo(companyResult.data);
        } else if (companyResult.error) {
          setCompanyError(companyResult.error);
          setError(companyResult.error);
        }
      } catch (err) {
        console.error("Failed to load company data:", err);
        setError("Failed to load store information. Please try again later.");
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
        <Text style={styles.loadingText}>Loading store information...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  // Only render StoreLocation when companyInfo is loaded
  if (!companyInfo || !companyInfo.locations) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorMessage}>No store locations found</Text>
      </View>
    );
  }

  // Wrap StoreLocation in a View for safety
  return (
    <View style={styles.container}>
      <StoreLocation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF3B30",
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});
