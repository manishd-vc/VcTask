import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useCompanyStore } from "../../store/companyStore";
import { StoreLocation } from "../../types";

// Mock nearby dealer data - in production, this would come from an API
const NEARBY_DEALERS = [
  {
    id: "d1",
    name: "Fantastic Tiles",
    type: "Authorized Dealer",
    address: "456 Satellite Road, Ahmedabad, Gujarat - 380015",
    phone: "+919876543211",
    distance: 3.2,
    coordinates: {
      latitude: 23.0325,
      longitude: 72.5814,
    },
  },
  {
    id: "d2",
    name: "Elegant Interiors",
    type: "Premium Retailer",
    address: "789 CG Road, Ahmedabad, Gujarat - 380009",
    phone: "+919876543212",
    distance: 5.7,
    coordinates: {
      latitude: 23.0425,
      longitude: 72.5614,
    },
  },
  {
    id: "d3",
    name: "Modern Tiles Gallery",
    type: "Authorized Dealer",
    address: "123 Prahlad Nagar, Ahmedabad, Gujarat - 380015",
    phone: "+919876543213",
    distance: 7.1,
    coordinates: {
      latitude: 23.0125,
      longitude: 72.5514,
    },
  },
];

interface DealerLocatorProps {
  onViewDealerDetails?: (dealer: any) => void;
}

const DealerLocator: React.FC<DealerLocatorProps> = ({
  onViewDealerDetails,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dealers, setDealers] = useState(NEARBY_DEALERS);
  const [selectedDealer, setSelectedDealer] = useState<any | null>(null);
  const [region, setRegion] = useState({
    latitude: 23.0225,
    longitude: 72.5714,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const { companyInfo } = useCompanyStore();

  useEffect(() => {
    // Use company's primary location for initial map center
    if (
      companyInfo &&
      companyInfo.locations &&
      companyInfo.locations.length > 0
    ) {
      const primaryLocation = companyInfo.locations[0];
      setRegion({
        latitude: primaryLocation.coordinates.latitude,
        longitude: primaryLocation.coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [companyInfo]);

  const handleSearch = () => {
    setLoading(true);

    // Simulate API call with 1s delay
    setTimeout(() => {
      if (!searchQuery.trim()) {
        setDealers(NEARBY_DEALERS);
      } else {
        const filteredDealers = NEARBY_DEALERS.filter(
          (dealer) =>
            dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            dealer.address.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setDealers(filteredDealers);
      }
      setLoading(false);
    }, 1000);
  };

  const handleSelectDealer = (dealer: any) => {
    setSelectedDealer(dealer);
    setRegion({
      latitude: dealer.coordinates.latitude,
      longitude: dealer.coordinates.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const handleGetDirections = (dealer: any) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${dealer.coordinates.latitude},${dealer.coordinates.longitude}`;
    Linking.openURL(url);
  };

  const handleCallDealer = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderDealerItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.dealerItem,
        selectedDealer?.id === item.id && styles.selectedDealerItem,
      ]}
      onPress={() => handleSelectDealer(item)}
    >
      <View style={styles.dealerHeader}>
        <Text style={styles.dealerName}>{item.name}</Text>
        <View style={styles.dealerTypeContainer}>
          <Text style={styles.dealerType}>{item.type}</Text>
        </View>
      </View>
      <Text style={styles.dealerAddress}>{item.address}</Text>
      <View style={styles.dealerFooter}>
        <Text style={styles.dealerDistance}>{item.distance} km away</Text>
        <View style={styles.dealerActions}>
          <TouchableOpacity
            style={styles.dealerAction}
            onPress={() => handleCallDealer(item.phone)}
          >
            <Text style={styles.dealerActionText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dealerAction}
            onPress={() => handleGetDirections(item)}
          >
            <Text style={styles.dealerActionText}>Directions</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by city, pincode or area..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {/* Company Store Marker */}
          {companyInfo?.locations.map((location: StoreLocation) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: location.coordinates.latitude,
                longitude: location.coordinates.longitude,
              }}
              title={location.name}
              description="Main Showroom"
              pinColor="#FF3B30"
            />
          ))}

          {/* Dealer Markers */}
          {dealers.map((dealer) => (
            <Marker
              key={dealer.id}
              coordinate={{
                latitude: dealer.coordinates.latitude,
                longitude: dealer.coordinates.longitude,
              }}
              title={dealer.name}
              description={dealer.type}
              pinColor={
                selectedDealer?.id === dealer.id ? "#007AFF" : "#34C759"
              }
              onPress={() => handleSelectDealer(dealer)}
            />
          ))}
        </MapView>
      </View>

      <View style={styles.dealersContainer}>
        <View style={styles.dealersHeader}>
          <Text style={styles.dealersTitle}>
            {dealers.length} Dealers{" "}
            {searchQuery ? `for "${searchQuery}"` : "nearby"}
          </Text>
          <TouchableOpacity onPress={() => setDealers(NEARBY_DEALERS)}>
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Finding dealers...</Text>
          </View>
        ) : dealers.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No dealers found for "{searchQuery}"
            </Text>
            <TouchableOpacity onPress={() => setDealers(NEARBY_DEALERS)}>
              <Text style={styles.viewAllText}>View all dealers</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={dealers}
            renderItem={renderDealerItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.dealersList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  searchContainer: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#F9F9F9",
  },
  searchButton: {
    height: 44,
    paddingHorizontal: 16,
    marginLeft: 8,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  mapContainer: {
    height: 300,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  dealersContainer: {
    flex: 1,
    marginTop: 16,
  },
  dealersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  dealersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  resetText: {
    fontSize: 14,
    color: "#007AFF",
  },
  dealersList: {
    padding: 16,
  },
  dealerItem: {
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  selectedDealerItem: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  dealerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  dealerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  dealerTypeContainer: {
    backgroundColor: "#34C759",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dealerType: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  dealerAddress: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  dealerFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dealerDistance: {
    fontSize: 14,
    color: "#8E8E93",
  },
  dealerActions: {
    flexDirection: "row",
  },
  dealerAction: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  dealerActionText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: "#8E8E93",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
});

export default DealerLocator;
