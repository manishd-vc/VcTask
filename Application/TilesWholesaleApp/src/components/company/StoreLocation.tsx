import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useCompanyStore } from "../../store/companyStore";
import { StoreLocation as StoreLocationType } from "../../types";

const { width } = Dimensions.get("window");

const StoreLocation: React.FC = () => {
  const { companyInfo } = useCompanyStore();

  if (!companyInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading store information...</Text>
      </View>
    );
  }

  const { locations } = companyInfo;

  const handleGetDirections = (location: StoreLocationType) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.latitude},${location.coordinates.longitude}`;
    Linking.openURL(url);
  };

  const handleCallPress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Our Store Locations</Text>
        <Text style={styles.subtitle}>
          Visit us to explore our wide range of premium tiles
        </Text>
      </View>

      {locations.map((location) => (
        <View key={location.id} style={styles.locationCard}>
          <Text style={styles.locationName}>{location.name}</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coordinates.latitude,
                longitude: location.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              pitchEnabled={false}
              rotateEnabled={false}
              zoomEnabled={true}
              scrollEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: location.coordinates.latitude,
                  longitude: location.coordinates.longitude,
                }}
                title={location.name}
                description={location.address}
              />
            </MapView>
          </View>

          <View style={styles.locationDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Address:</Text>
              <Text style={styles.detailValue}>
                {location.address}, {location.city}, {location.state} -{" "}
                {location.pincode}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <TouchableOpacity onPress={() => handleCallPress(location.phone)}>
                <Text style={styles.detailValueLink}>{location.phone}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{location.email}</Text>
            </View>

            <View style={styles.hoursContainer}>
              <Text style={styles.hoursTitle}>Opening Hours:</Text>
              {location.openingHours.map((hour, index) => (
                <View key={index} style={styles.hourRow}>
                  <Text style={styles.dayText}>{hour.day}</Text>
                  <Text style={styles.hoursText}>{hour.hours}</Text>
                </View>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.directionsButton}
            onPress={() => handleGetDirections(location)}
          >
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.contactUs}>
        <Text style={styles.contactUsTitle}>Can't Visit?</Text>
        <Text style={styles.contactUsText}>
          Contact us for virtual consultation or home visit in select areas.
        </Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleCallPress(companyInfo.contactInfo.phone)}
        >
          <Text style={styles.contactButtonText}>Contact Now</Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  locationCard: {
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  mapContainer: {
    height: 200,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  map: {
    height: "100%",
    width: "100%",
  },
  locationDetails: {
    padding: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 15,
    color: "#333",
  },
  detailValueLink: {
    fontSize: 15,
    color: "#007AFF",
  },
  hoursContainer: {
    marginTop: 8,
  },
  hoursTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  hourRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  hoursText: {
    fontSize: 14,
    color: "#333",
  },
  directionsButton: {
    margin: 16,
    marginTop: 0,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  directionsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  contactUs: {
    margin: 16,
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    alignItems: "center",
  },
  contactUsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  contactUsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: "#34C759",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default StoreLocation;
