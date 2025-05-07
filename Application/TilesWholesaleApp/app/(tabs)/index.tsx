import ProductCard from "@/src/components/product/ProductCard";
import {
  companyApi,
  initializeAppData,
  productApi,
} from "@/src/services/apiService";
import { useCompanyStore } from "@/src/store/companyStore";
import { useProductStore } from "@/src/store/productStore";
import { Product } from "@/src/types";
import { useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const PROMO_IMAGES = [
  "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1560184897-67f4a3f9a7fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
];

// Global initialization flag
let APP_DATA_INITIALIZED = false;

export default function HomeScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

  // Use ref to track initialization status within the component
  const dataInitializedRef = useRef(false);

  const {
    products,
    setProducts,
    setLoading: setProductsLoading,
    setError: setProductsError,
    getFeaturedProducts,
    getNewArrivals,
  } = useProductStore();

  const {
    companyInfo,
    setCompanyInfo,
    setLoading: setCompanyLoading,
    setError: setCompanyError,
  } = useCompanyStore();

  // Split initialization and data loading into separate effects
  useEffect(() => {
    // Only run initialization once
    const initApp = async () => {
      if (APP_DATA_INITIALIZED || dataInitializedRef.current) return;

      try {
        await initializeAppData();
        APP_DATA_INITIALIZED = true;
        dataInitializedRef.current = true;
      } catch (error) {
        console.error("Failed to initialize app data:", error);
        setInitError("Failed to initialize application data");
      }
    };

    initApp();
  }, []);

  // Load products and company info in a separate effect
  useEffect(() => {
    const loadData = async () => {
      if (!dataInitializedRef.current) return;

      try {
        setLoading(true);

        // Load company info
        const companyResult = await companyApi.getCompanyInfo();
        if (companyResult.data) {
          setCompanyInfo(companyResult.data);
        } else if (companyResult.error) {
          setCompanyError(companyResult.error);
        }

        // Load products
        const productsResult = await productApi.getProducts();
        if (productsResult.data) {
          setProducts(productsResult.data);
        } else if (productsResult.error) {
          setProductsError(productsResult.error);
        }
      } catch (error) {
        console.error("Failed to load app data:", error);
        setInitError("Failed to load application data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dataInitializedRef.current]);

  // Promo banner rotation
  useEffect(() => {
    const promoInterval = setInterval(() => {
      setCurrentPromoIndex((prevIndex) =>
        prevIndex === PROMO_IMAGES.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(promoInterval);
  }, []);

  const renderFeaturedProduct = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  const renderNewArrival = ({ item }: { item: Product }) => (
    <ProductCard product={item} />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const featuredProducts = getFeaturedProducts();
  const newArrivals = getNewArrivals();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Company Header */}
      <View style={styles.header}>
        {companyInfo?.logo ? (
          <Image
            source={{ uri: companyInfo.logo }}
            style={styles.logo}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.placeholderLogo}>
            <Text style={styles.placeholderText}>Premium Tiles</Text>
          </View>
        )}
        <Text style={styles.companyName}>
          {companyInfo?.name || "Premium Tiles Wholesale"}
        </Text>
        <Text style={styles.tagline}>
          {companyInfo?.tagline || "Quality Tiles for Every Space"}
        </Text>
      </View>

      {/* Promotional Banner */}
      <View style={styles.promoContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.promoBanner}
        >
          <Image
            source={{ uri: PROMO_IMAGES[currentPromoIndex] }}
            style={styles.promoImage}
            resizeMode="cover"
          />
          <View style={styles.promoOverlay}>
            <Text style={styles.promoTitle}>Special Offer</Text>
            <Text style={styles.promoDescription}>
              Discover our premium collection with special wholesale prices
            </Text>
            <TouchableOpacity
              style={styles.promoButton}
              onPress={() => {
                navigation.navigate("catalog" as never);
              }}
            >
              <Text style={styles.promoButtonText}>Explore Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <View style={styles.promoDots}>
          {PROMO_IMAGES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.promoDot,
                currentPromoIndex === index && styles.activePromoDot,
              ]}
            />
          ))}
        </View>
      </View>

      {/* Featured Products */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("catalog" as never);
            }}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={featuredProducts.slice(0, 4)}
          renderItem={renderFeaturedProduct}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No featured products available
              </Text>
            </View>
          }
        />
      </View>

      {/* Categories Quick Access */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <View style={styles.categoryBtnContainer}>
          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => {
              navigation.navigate("categories" as never);
            }}
          >
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>🧱</Text>
            </View>
            <Text style={styles.categoryText}>Ceramic</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => {
              navigation.navigate("categories" as never);
            }}
          >
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>✨</Text>
            </View>
            <Text style={styles.categoryText}>Porcelain</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => {
              navigation.navigate("categories" as never);
            }}
          >
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>🏠</Text>
            </View>
            <Text style={styles.categoryText}>Vitrified</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryBtn}
            onPress={() => {
              navigation.navigate("categories" as never);
            }}
          >
            <View style={styles.categoryIcon}>
              <Text style={styles.categoryIconText}>💎</Text>
            </View>
            <Text style={styles.categoryText}>Marble</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* New Arrivals */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>New Arrivals</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("catalog" as never);
            }}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={newArrivals.slice(0, 4)}
          renderItem={renderNewArrival}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No new arrivals available</Text>
            </View>
          }
        />
      </View>

      {/* Contact Banner */}
      <View style={styles.contactBanner}>
        <Text style={styles.contactBannerTitle}>Need Help Choosing?</Text>
        <Text style={styles.contactBannerText}>
          Our expert consultants are ready to assist you in selecting the
          perfect tiles for your space.
        </Text>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => {
            navigation.navigate("contact" as never);
          }}
        >
          <Text style={styles.contactButtonText}>Contact Us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  logo: {
    width: 100,
    height: 60,
    marginBottom: 8,
  },
  placeholderLogo: {
    width: 100,
    height: 60,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    borderRadius: 8,
  },
  placeholderText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  tagline: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  promoContainer: {
    height: 200,
    width: "100%",
    marginBottom: 20,
  },
  promoBanner: {
    height: "100%",
  },
  promoImage: {
    width,
    height: 200,
  },
  promoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 20,
    justifyContent: "center",
  },
  promoTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  promoDescription: {
    color: "white",
    fontSize: 16,
    marginBottom: 16,
  },
  promoButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  promoButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  promoDots: {
    flexDirection: "row",
    justifyContent: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  promoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activePromoDot: {
    backgroundColor: "#FFFFFF",
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  seeAllText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  productsContainer: {
    paddingHorizontal: 8,
  },
  emptyContainer: {
    width: width - 32,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  categoriesContainer: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  categoryBtnContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  categoryBtn: {
    alignItems: "center",
    width: (width - 64) / 4,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  categoryIconText: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  contactBanner: {
    margin: 16,
    padding: 20,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 40,
  },
  contactBannerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  contactBannerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: "#007AFF",
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
