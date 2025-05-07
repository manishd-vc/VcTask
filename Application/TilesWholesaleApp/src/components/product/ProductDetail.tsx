import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Linking,
  Share,
  Alert,
} from "react-native";
import { Product } from "../../types";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const navigation = useNavigation();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const handleContactPress = () => {
    // @ts-ignore - we'll set up proper typing for navigation later
    navigation.navigate("InquiryForm", { productId: product.id });
  };

  const handleCallPress = () => {
    Linking.openURL("tel:+919876543210");
  };

  const handleWhatsappPress = () => {
    const message = `I'm interested in ${product.name} tiles. Could you provide more information?`;
    Linking.openURL(
      `whatsapp://send?phone=+919876543210&text=${encodeURIComponent(message)}`
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out these amazing ${product.name} tiles at Premium Tiles Wholesale! Contact: +919876543210`,
        title: `${product.name} - Premium Tiles Wholesale`,
      });
    } catch (error) {
      Alert.alert("Error", "Could not share product");
    }
  };

  const renderColorOption = (color: string, index: number) => {
    return (
      <TouchableOpacity
        key={index}
        style={[styles.colorOption, { backgroundColor: color.toLowerCase() }]}
      />
    );
  };

  const renderSizeOption = (
    size: { width: number; height: number; unit: string },
    index: number
  ) => {
    return (
      <TouchableOpacity key={index} style={styles.sizeOption}>
        <Text style={styles.sizeText}>
          {size.width}x{size.height} {size.unit}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Image Carousel */}
      <View style={styles.carouselContainer}>
        <Image
          source={{ uri: product.images[activeImageIndex] }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.thumbnailContainer}
        >
          {product.images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveImageIndex(index)}
              style={[
                styles.thumbnail,
                activeImageIndex === index && styles.activeThumbnail,
              ]}
            >
              <Image
                source={{ uri: image }}
                style={styles.thumbnailImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Product Info */}
      <View style={styles.infoContainer}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.type}>{product.tileType}</Text>
          </View>
          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price:</Text>
          <Text style={styles.price}>
            {product.contactForPrice
              ? "Contact for Price"
              : product.priceRange
              ? `₹${product.priceRange.min} - ₹${product.priceRange.max}`
              : "Price on request"}
          </Text>
        </View>

        <Text style={styles.description}>{product.description}</Text>

        {/* Stock Status */}
        <View style={styles.stockContainer}>
          <Text style={styles.stockLabel}>Availability:</Text>
          <View style={styles.stockStatus}>
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
            <Text style={styles.stockText}>
              {product.stockStatus === "in-stock"
                ? "In Stock"
                : product.stockStatus === "low-stock"
                ? "Low Stock"
                : "Out of Stock"}
            </Text>
          </View>
        </View>

        {/* Color Options */}
        {product.colors.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Available Colors:</Text>
            <View style={styles.colorsContainer}>
              {product.colors.map((color, index) =>
                renderColorOption(color, index)
              )}
            </View>
          </View>
        )}

        {/* Size Options */}
        {product.sizes.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Available Sizes:</Text>
            <View style={styles.sizesContainer}>
              {product.sizes.map((size, index) =>
                renderSizeOption(size, index)
              )}
            </View>
          </View>
        )}

        {/* Finishes */}
        {product.finishes.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Available Finishes:</Text>
            <View style={styles.tagsContainer}>
              {product.finishes.map((finish, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{finish}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Patterns */}
        {product.patterns.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Patterns:</Text>
            <View style={styles.tagsContainer}>
              {product.patterns.map((pattern, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{pattern}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Room Types */}
        {product.roomTypes.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Ideal For:</Text>
            <View style={styles.tagsContainer}>
              {product.roomTypes.map((room, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{room}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Specifications */}
        <View style={styles.specificationsContainer}>
          <Text style={styles.sectionTitle}>Technical Specifications:</Text>
          <View style={styles.specsTable}>
            <View style={styles.specRow}>
              <Text style={styles.specName}>Thickness</Text>
              <Text style={styles.specValue}>
                {product.specifications.thickness} mm
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specName}>Material</Text>
              <Text style={styles.specValue}>
                {product.specifications.material}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specName}>Water Resistance</Text>
              <Text style={styles.specValue}>
                {product.specifications.waterResistance}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specName}>Slip Resistance</Text>
              <Text style={styles.specValue}>
                {product.specifications.slipResistance}
              </Text>
            </View>
            <View style={styles.specRow}>
              <Text style={styles.specName}>Maintenance Level</Text>
              <Text style={styles.specValue}>
                {product.specifications.maintenanceLevel}
              </Text>
            </View>
            {/* Additional specifications can be rendered here */}
          </View>
        </View>
      </View>

      {/* Contact Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.inquiryButton}
          onPress={handleContactPress}
        >
          <Text style={styles.inquiryButtonText}>Send Inquiry</Text>
        </TouchableOpacity>

        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.callButton} onPress={handleCallPress}>
            <Text style={styles.callButtonText}>Call Now</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.whatsappButton}
            onPress={handleWhatsappPress}
          >
            <Text style={styles.whatsappButtonText}>WhatsApp</Text>
          </TouchableOpacity>
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
  carouselContainer: {
    backgroundColor: "#F5F5F5",
  },
  mainImage: {
    width: width,
    height: width,
  },
  thumbnailContainer: {
    padding: 12,
    flexDirection: "row",
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 6,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  activeThumbnail: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    color: "#666",
    textTransform: "capitalize",
  },
  shareButton: {
    backgroundColor: "#F2F2F7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  shareButtonText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  priceLabel: {
    fontSize: 16,
    color: "#333",
    marginRight: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#007AFF",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#333",
    marginBottom: 16,
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stockLabel: {
    fontSize: 15,
    color: "#333",
    marginRight: 8,
  },
  stockStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  stockIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
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
  stockText: {
    fontSize: 15,
    color: "#333",
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  colorsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  sizesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  sizeOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
    marginBottom: 8,
  },
  sizeText: {
    fontSize: 14,
    color: "#333",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: "#333",
    textTransform: "capitalize",
  },
  specificationsContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  specsTable: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    overflow: "hidden",
  },
  specRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  specName: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: "#333",
    backgroundColor: "#F9F9F9",
    fontWeight: "500",
  },
  specValue: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    color: "#333",
    textTransform: "capitalize",
  },
  actionsContainer: {
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  inquiryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  inquiryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  contactButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  callButton: {
    flex: 1,
    backgroundColor: "#34C759",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 8,
  },
  callButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: "#25D366",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 8,
  },
  whatsappButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProductDetail;
