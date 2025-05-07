import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from "react-native";
import { useProductStore } from "../../store/productStore";
import { Product } from "../../types";

const { width } = Dimensions.get("window");

interface TileComparisonToolProps {
  isVisible: boolean;
  onClose: () => void;
}

const TileComparisonTool: React.FC<TileComparisonToolProps> = ({
  isVisible,
  onClose,
}) => {
  const { products } = useProductStore();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showProductSelector, setShowProductSelector] = useState(false);

  const addProductToComparison = (product: Product) => {
    if (selectedProducts.length < 4) {
      setSelectedProducts((prev) => [...prev, product]);
    }
    setShowProductSelector(false);
  };

  const removeProductFromComparison = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  const renderComparisonRow = (
    label: string,
    getValue: (product: Product) => React.ReactNode
  ) => (
    <View style={styles.comparisonRow}>
      <View style={styles.labelCell}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
      {selectedProducts.map((product) => (
        <View key={product.id} style={styles.valueCell}>
          {getValue(product)}
        </View>
      ))}
      {Array.from({ length: 4 - selectedProducts.length }).map((_, index) => (
        <View key={`empty-${index}`} style={styles.valueCell}>
          <Text>-</Text>
        </View>
      ))}
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Compare Tiles</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {selectedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Select up to 4 tiles to compare
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowProductSelector(true)}
            >
              <Text style={styles.addButtonText}>+ Add Tiles</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView horizontal={true} style={styles.productHeader}>
              <View style={styles.comparisonRow}>
                <View style={styles.labelCell} />
                {selectedProducts.map((product) => (
                  <View key={product.id} style={styles.productCell}>
                    <Image
                      source={{ uri: product.thumbnail }}
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.productName} numberOfLines={2}>
                      {product.name}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => removeProductFromComparison(product.id)}
                    >
                      <Text style={styles.removeButtonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                ))}
                {selectedProducts.length < 4 && (
                  <TouchableOpacity
                    style={styles.addTileCell}
                    onPress={() => setShowProductSelector(true)}
                  >
                    <Text style={styles.addTileCellText}>+ Add Tile</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>

            <ScrollView style={styles.comparisonTable}>
              {renderComparisonRow("Type", (product) => (
                <Text style={styles.valueText}>{product.tileType}</Text>
              ))}
              {renderComparisonRow("Size", (product) => (
                <Text style={styles.valueText}>
                  {product.sizes[0]?.width}x{product.sizes[0]?.height}{" "}
                  {product.sizes[0]?.unit}
                </Text>
              ))}
              {renderComparisonRow("Finish", (product) => (
                <Text style={styles.valueText}>
                  {product.finishes.join(", ")}
                </Text>
              ))}
              {renderComparisonRow("Water Resistance", (product) => (
                <Text style={styles.valueText}>
                  {product.specifications.waterResistance}
                </Text>
              ))}
              {renderComparisonRow("Slip Resistance", (product) => (
                <Text style={styles.valueText}>
                  {product.specifications.slipResistance}
                </Text>
              ))}
              {renderComparisonRow("Maintenance", (product) => (
                <Text style={styles.valueText}>
                  {product.specifications.maintenanceLevel}
                </Text>
              ))}
              {renderComparisonRow("Price", (product) => (
                <Text style={styles.valueText}>
                  {product.contactForPrice
                    ? "Contact"
                    : product.priceRange
                    ? `₹${product.priceRange.min} - ₹${product.priceRange.max}`
                    : "On request"}
                </Text>
              ))}
            </ScrollView>
          </>
        )}

        <Modal
          visible={showProductSelector}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowProductSelector(false)}
        >
          <View style={styles.selectorContainer}>
            <View style={styles.selectorContent}>
              <View style={styles.selectorHeader}>
                <Text style={styles.selectorTitle}>Select Tiles</Text>
                <TouchableOpacity onPress={() => setShowProductSelector(false)}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.productList}>
                {products
                  .filter(
                    (product) =>
                      !selectedProducts.some((p) => p.id === product.id)
                  )
                  .map((product) => (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productItem}
                      onPress={() => addProductToComparison(product)}
                    >
                      <Image
                        source={{ uri: product.thumbnail }}
                        style={styles.productItemImage}
                      />
                      <View style={styles.productItemInfo}>
                        <Text style={styles.productItemName}>
                          {product.name}
                        </Text>
                        <Text style={styles.productItemType}>
                          {product.tileType}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
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
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#8E8E93",
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  productHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  comparisonTable: {
    flex: 1,
  },
  comparisonRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  labelCell: {
    width: 100,
    padding: 12,
    backgroundColor: "#F9F9F9",
  },
  labelText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  valueCell: {
    width: 100,
    padding: 12,
    alignItems: "center",
  },
  valueText: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
  },
  productCell: {
    width: 120,
    padding: 8,
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  removeButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
  },
  addTileCell: {
    width: 120,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
    borderRadius: 8,
    margin: 8,
    height: 150,
  },
  addTileCellText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "500",
  },
  selectorContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  selectorContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: "75%",
  },
  selectorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  selectorTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  productList: {
    padding: 16,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  productItemImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  productItemInfo: {
    flex: 1,
  },
  productItemName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  productItemType: {
    fontSize: 14,
    color: "#8E8E93",
  },
});

export default TileComparisonTool;
