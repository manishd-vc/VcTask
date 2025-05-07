import ProductCard from "@/src/components/product/ProductCard";
import ProductFilters from "@/src/components/product/ProductFilters";
import { productApi } from "@/src/services/apiService";
import { useProductStore } from "@/src/store/productStore";
import { Product } from "@/src/types";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function CatalogScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ category?: string; type?: string }>();
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const initialLoadDone = useRef(false);

  const {
    products,
    filteredProducts,
    setProducts,
    setLoading: setProductsLoading,
    setError: setProductsError,
    setTileTypeFilter,
    clearFilters,
  } = useProductStore();

  // Load products only once
  useEffect(() => {
    if (initialLoadDone.current) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setLoadError(null);

        // Load products
        const productsResult = await productApi.getProducts();
        if (productsResult.data) {
          if (productsResult.data.length === 0) {
            setLoadError("No products found. Please try again later.");
          } else {
            setProducts(productsResult.data);
            initialLoadDone.current = true;
          }
        } else if (productsResult.error) {
          setProductsError(productsResult.error);
          setLoadError(productsResult.error);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        setLoadError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Apply filters from URL params separately
  useEffect(() => {
    // Only apply filters if we have products
    if (products.length > 0 && params.type) {
      // Use setTimeout to avoid immediate state updates
      setTimeout(() => {
        // @ts-ignore - type is a string and setTileTypeFilter expects TileType
        setTileTypeFilter(params.type);
      }, 0);
    }
  }, [params.type, products.length]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearFilters();
    };
  }, []);

  const handleProductPress = useCallback(
    (product: Product) => {
      try {
        // @ts-ignore - we'll set up proper typing for navigation later
        navigation.navigate("ProductDetail", { productId: product.id });
      } catch (error) {
        console.error("Navigation error:", error);
        Alert.alert(
          "Error",
          "Could not view product details. Please try again."
        );
      }
    },
    [navigation]
  );

  const renderProduct = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={() => handleProductPress(item)} />
    ),
    [handleProductPress]
  );

  const retryLoading = useCallback(async () => {
    setLoading(true);
    try {
      const productsResult = await productApi.getProducts();
      if (productsResult.data) {
        setProducts(productsResult.data);
        setLoadError(null);
      } else {
        setLoadError("Still unable to load products. Please try again later.");
      }
    } catch (error) {
      setLoadError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      <ProductFilters onApplyFilters={() => {}} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      ) : loadError ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Error Loading Products</Text>
          <Text style={styles.errorDescription}>{loadError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={retryLoading}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsText}>
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"} found
            </Text>
            <TouchableOpacity onPress={() => clearFilters()}>
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filteredProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.productsContainer}
            columnWrapperStyle={styles.columnWrapper}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyTitle}>No Products Found</Text>
                <Text style={styles.emptyDescription}>
                  Try adjusting your filters or browse our full catalog
                </Text>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={() => clearFilters()}
                >
                  <Text style={styles.resetButtonText}>
                    Browse All Products
                  </Text>
                </TouchableOpacity>
              </View>
            }
          />
        </>
      )}
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
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF3B30",
    marginBottom: 12,
  },
  errorDescription: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  resultsText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  clearFiltersText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  productsContainer: {
    padding: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    height: 300,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
  },
});
