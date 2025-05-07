import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Product } from "../../types";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // 2 cards per row with spacing

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const navigation = useNavigation();

  // Guard against invalid product data
  if (!product || !product.id) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Product data missing</Text>
      </View>
    );
  }

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      try {
        // @ts-ignore - we'll set up proper typing for navigation later
        navigation.navigate("ProductDetail", { productId: product.id });
      } catch (error) {
        console.error("Navigation error:", error);
        // Could show an alert here if needed
      }
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {product.new && (
          <View style={styles.newBadge}>
            <Text style={styles.newText}>NEW</Text>
          </View>
        )}
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="cover"
          defaultSource={require("../../../assets/images/icon.png")}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.type} numberOfLines={1}>
          {product.tileType}
        </Text>
        <View style={styles.detailsRow}>
          <Text style={styles.size}>
            {product.sizes && product.sizes[0]
              ? `${product.sizes[0].width}x${product.sizes[0].height} ${product.sizes[0].unit}`
              : "Size N/A"}
          </Text>
          <View
            style={[
              styles.stockIndicator,
              product.stockStatus === "in-stock"
                ? styles.inStock
                : product.stockStatus === "low-stock"
                ? styles.lowStock
                : styles.outOfStock,
            ]}
          />
        </View>
        <Text style={styles.price}>
          {product.contactForPrice
            ? "Contact for Price"
            : product.priceRange
            ? `₹${product.priceRange.min} - ₹${product.priceRange.max}`
            : "Price on request"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    overflow: "hidden",
    margin: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  errorContainer: {
    justifyContent: "center",
    alignItems: "center",
    height: 200,
    backgroundColor: "#f8f8f8",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    textAlign: "center",
    padding: 16,
  },
  imageContainer: {
    position: "relative",
    height: cardWidth,
    width: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  newBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  newText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  type: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  size: {
    fontSize: 12,
    color: "#888",
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inStock: {
    backgroundColor: "#34C759",
  },
  lowStock: {
    backgroundColor: "#FF9500",
  },
  outOfStock: {
    backgroundColor: "#FF3B30",
  },
  price: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
  },
});

export default ProductCard;
