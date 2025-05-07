import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { TileType, TileFinish, RoomType } from "../../types";
import { useProductStore } from "../../store/productStore";

interface ProductFiltersProps {
  onApplyFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onApplyFilters }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "type" | "room" | "size" | "color" | "finish" | "price" | null
  >(null);

  const {
    tileTypeFilter,
    roomTypeFilter,
    colorFilters,
    finishFilters,
    setTileTypeFilter,
    setRoomTypeFilter,
    setColorFilters,
    setFinishFilters,
    setPriceRangeFilter,
    clearFilters,
  } = useProductStore();

  // Sample option arrays for filters
  const tileTypes: TileType[] = [
    "ceramic",
    "porcelain",
    "vitrified",
    "marble",
    "granite",
    "mosaic",
    "other",
  ];
  const roomTypes: RoomType[] = [
    "bathroom",
    "kitchen",
    "living room",
    "bedroom",
    "outdoor",
    "commercial",
    "other",
  ];
  const finishOptions: TileFinish[] = [
    "glossy",
    "matte",
    "textured",
    "polished",
    "rustic",
    "satin",
    "other",
  ];
  const colorOptions = [
    "White",
    "Black",
    "Beige",
    "Grey",
    "Blue",
    "Green",
    "Brown",
    "Multicolor",
  ];

  const showFilterModal = (
    filterType: "type" | "room" | "size" | "color" | "finish" | "price"
  ) => {
    setActiveFilter(filterType);
    setIsModalVisible(true);
  };

  const handleApplyFilters = () => {
    setIsModalVisible(false);
    onApplyFilters();
  };

  const renderFilterOptions = () => {
    switch (activeFilter) {
      case "type":
        return (
          <View style={styles.filterOptionsContainer}>
            <Text style={styles.filterTitle}>Tile Type</Text>
            <View style={styles.optionsGrid}>
              {tileTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    tileTypeFilter === type && styles.selectedChip,
                  ]}
                  onPress={() =>
                    setTileTypeFilter(tileTypeFilter === type ? null : type)
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      tileTypeFilter === type && styles.selectedChipText,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "room":
        return (
          <View style={styles.filterOptionsContainer}>
            <Text style={styles.filterTitle}>Room Type</Text>
            <View style={styles.optionsGrid}>
              {roomTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterChip,
                    roomTypeFilter === type && styles.selectedChip,
                  ]}
                  onPress={() =>
                    setRoomTypeFilter(roomTypeFilter === type ? null : type)
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      roomTypeFilter === type && styles.selectedChipText,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "color":
        return (
          <View style={styles.filterOptionsContainer}>
            <Text style={styles.filterTitle}>Color</Text>
            <View style={styles.optionsGrid}>
              {colorOptions.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.filterChip,
                    colorFilters.includes(color) && styles.selectedChip,
                  ]}
                  onPress={() => {
                    const updatedColors = colorFilters.includes(color)
                      ? colorFilters.filter((c) => c !== color)
                      : [...colorFilters, color];
                    setColorFilters(updatedColors);
                  }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      colorFilters.includes(color) && styles.selectedChipText,
                    ]}
                  >
                    {color}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "finish":
        return (
          <View style={styles.filterOptionsContainer}>
            <Text style={styles.filterTitle}>Finish</Text>
            <View style={styles.optionsGrid}>
              {finishOptions.map((finish) => (
                <TouchableOpacity
                  key={finish}
                  style={[
                    styles.filterChip,
                    finishFilters.includes(finish) && styles.selectedChip,
                  ]}
                  onPress={() => {
                    const updatedFinishes = finishFilters.includes(finish)
                      ? finishFilters.filter((f) => f !== finish)
                      : [...finishFilters, finish];
                    setFinishFilters(updatedFinishes);
                  }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      finishFilters.includes(finish) && styles.selectedChipText,
                    ]}
                  >
                    {finish.charAt(0).toUpperCase() + finish.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "price":
        return (
          <View style={styles.filterOptionsContainer}>
            <Text style={styles.filterTitle}>Price Range</Text>
            <View style={styles.priceRangeOptions}>
              <TouchableOpacity
                style={styles.priceRangeOption}
                onPress={() => setPriceRangeFilter({ min: 0, max: 1000 })}
              >
                <Text style={styles.priceRangeText}>₹0 - ₹1000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.priceRangeOption}
                onPress={() => setPriceRangeFilter({ min: 1000, max: 2000 })}
              >
                <Text style={styles.priceRangeText}>₹1000 - ₹2000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.priceRangeOption}
                onPress={() => setPriceRangeFilter({ min: 2000, max: 5000 })}
              >
                <Text style={styles.priceRangeText}>₹2000 - ₹5000</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.priceRangeOption}
                onPress={() =>
                  setPriceRangeFilter({ min: 5000, max: null as any })
                }
              >
                <Text style={styles.priceRangeText}>₹5000+</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const hasActiveFilters =
    tileTypeFilter ||
    roomTypeFilter ||
    colorFilters.length > 0 ||
    finishFilters.length > 0;

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            tileTypeFilter && styles.activeFilterButton,
          ]}
          onPress={() => showFilterModal("type")}
        >
          <Text
            style={[
              styles.filterButtonText,
              tileTypeFilter && styles.activeFilterText,
            ]}
          >
            Type
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            roomTypeFilter && styles.activeFilterButton,
          ]}
          onPress={() => showFilterModal("room")}
        >
          <Text
            style={[
              styles.filterButtonText,
              roomTypeFilter && styles.activeFilterText,
            ]}
          >
            Room
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => showFilterModal("size")}
        >
          <Text style={styles.filterButtonText}>Size</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            colorFilters.length > 0 && styles.activeFilterButton,
          ]}
          onPress={() => showFilterModal("color")}
        >
          <Text
            style={[
              styles.filterButtonText,
              colorFilters.length > 0 && styles.activeFilterText,
            ]}
          >
            Color
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterButton,
            finishFilters.length > 0 && styles.activeFilterButton,
          ]}
          onPress={() => showFilterModal("finish")}
        >
          <Text
            style={[
              styles.filterButtonText,
              finishFilters.length > 0 && styles.activeFilterText,
            ]}
          >
            Finish
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => showFilterModal("price")}
        >
          <Text style={styles.filterButtonText}>Price</Text>
        </TouchableOpacity>

        {hasActiveFilters && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              clearFilters();
              onApplyFilters();
            }}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {renderFilterOptions()}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyFilters}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: "#007AFF",
  },
  filterButtonText: {
    fontSize: 14,
    color: "#333",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  clearButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FF3B30",
    marginRight: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 24,
    maxHeight: "80%",
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
    fontSize: 20,
    color: "#8E8E93",
    padding: 4,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  applyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  // Filter options styles
  filterOptionsContainer: {
    padding: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: "#007AFF",
  },
  filterChipText: {
    fontSize: 14,
    color: "#333",
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
  priceRangeOptions: {
    marginTop: 8,
  },
  priceRangeOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  priceRangeText: {
    fontSize: 16,
    color: "#333",
  },
});

export default ProductFilters;
