import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from "react-native";
import { TileSize } from "../../types";

interface InstallationCalculatorProps {
  isVisible: boolean;
  onClose: () => void;
  availableSizes?: TileSize[];
  onCalculationComplete?: (results: CalculationResult) => void;
}

interface CalculationResult {
  totalArea: number;
  tilesNeeded: number;
  wastageAmount: number;
  totalTiles: number;
}

const InstallationCalculator: React.FC<InstallationCalculatorProps> = ({
  isVisible,
  onClose,
  availableSizes = [],
  onCalculationComplete,
}) => {
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [unit, setUnit] = useState<"feet" | "meters">("feet");
  const [selectedTileSize, setSelectedTileSize] = useState<TileSize | null>(
    availableSizes.length > 0 ? availableSizes[0] : null
  );
  const [wastagePercentage, setWastagePercentage] = useState("10");
  const [results, setResults] = useState<CalculationResult | null>(null);

  useEffect(() => {
    if (availableSizes.length > 0 && !selectedTileSize) {
      setSelectedTileSize(availableSizes[0]);
    }
  }, [availableSizes]);

  const convertToSquareMeters = (
    length: number,
    width: number,
    unit: "feet" | "meters"
  ): number => {
    if (unit === "feet") {
      return length * width * 0.092903; // 1 sq ft = 0.092903 sq m
    }
    return length * width;
  };

  const convertTileSizeToSquareMeters = (tileSize: TileSize): number => {
    const { width: tileWidth, height: tileHeight, unit: tileUnit } = tileSize;
    let widthInMeters = tileWidth;
    let heightInMeters = tileHeight;

    if (tileUnit === "mm") {
      widthInMeters = tileWidth / 1000;
      heightInMeters = tileHeight / 1000;
    } else if (tileUnit === "cm") {
      widthInMeters = tileWidth / 100;
      heightInMeters = tileHeight / 100;
    } else if (tileUnit === "inch") {
      widthInMeters = tileWidth * 0.0254;
      heightInMeters = tileHeight * 0.0254;
    }

    return widthInMeters * heightInMeters;
  };

  const calculateTiles = () => {
    if (!length || !width || !selectedTileSize) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const roomLengthNum = parseFloat(length);
    const roomWidthNum = parseFloat(width);
    const wastagePercent = parseFloat(wastagePercentage) || 0;

    if (isNaN(roomLengthNum) || isNaN(roomWidthNum)) {
      Alert.alert("Error", "Length and width must be valid numbers");
      return;
    }

    const totalAreaSqM = convertToSquareMeters(
      roomLengthNum,
      roomWidthNum,
      unit
    );
    const tileSizeSqM = convertTileSizeToSquareMeters(selectedTileSize);

    const tilesNeeded = Math.ceil(totalAreaSqM / tileSizeSqM);
    const wastageAmount = Math.ceil(tilesNeeded * (wastagePercent / 100));
    const totalTiles = tilesNeeded + wastageAmount;

    const calculationResult = {
      totalArea: totalAreaSqM,
      tilesNeeded,
      wastageAmount,
      totalTiles,
    };

    setResults(calculationResult);

    if (onCalculationComplete) {
      onCalculationComplete(calculationResult);
    }
  };

  const resetCalculator = () => {
    setLength("");
    setWidth("");
    setUnit("feet");
    setWastagePercentage("10");
    setResults(null);
    if (availableSizes.length > 0) {
      setSelectedTileSize(availableSizes[0]);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tile Calculator</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Room Dimensions</Text>

          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Length</Text>
              <TextInput
                style={styles.input}
                value={length}
                onChangeText={setLength}
                keyboardType="numeric"
                placeholder="Enter length"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Width</Text>
              <TextInput
                style={styles.input}
                value={width}
                onChangeText={setWidth}
                keyboardType="numeric"
                placeholder="Enter width"
              />
            </View>
          </View>

          <View style={styles.unitSelector}>
            <Text style={styles.inputLabel}>Unit:</Text>
            <View style={styles.unitOptions}>
              <TouchableOpacity
                style={[
                  styles.unitOption,
                  unit === "feet" && styles.selectedUnitOption,
                ]}
                onPress={() => setUnit("feet")}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    unit === "feet" && styles.selectedUnitOptionText,
                  ]}
                >
                  Feet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.unitOption,
                  unit === "meters" && styles.selectedUnitOption,
                ]}
                onPress={() => setUnit("meters")}
              >
                <Text
                  style={[
                    styles.unitOptionText,
                    unit === "meters" && styles.selectedUnitOptionText,
                  ]}
                >
                  Meters
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Tile Size</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tileSizesContainer}
          >
            {availableSizes.length > 0 ? (
              availableSizes.map((size, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.tileSizeOption,
                    selectedTileSize &&
                      selectedTileSize.width === size.width &&
                      selectedTileSize.height === size.height &&
                      styles.selectedTileSizeOption,
                  ]}
                  onPress={() => setSelectedTileSize(size)}
                >
                  <Text
                    style={[
                      styles.tileSizeText,
                      selectedTileSize &&
                        selectedTileSize.width === size.width &&
                        selectedTileSize.height === size.height &&
                        styles.selectedTileSizeText,
                    ]}
                  >
                    {size.width}x{size.height} {size.unit}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noSizesContainer}>
                <Text style={styles.noSizesText}>
                  No tile sizes available. Enter custom size below.
                </Text>
              </View>
            )}
          </ScrollView>

          <Text style={styles.sectionTitle}>Wastage Percentage</Text>
          <View style={styles.wastageContainer}>
            <TextInput
              style={styles.wastageInput}
              value={wastagePercentage}
              onChangeText={setWastagePercentage}
              keyboardType="numeric"
              placeholder="Wastage %"
            />
            <Text style={styles.wastageText}>%</Text>
            <Text style={styles.wastageHelper}>
              Recommended: 10% for simple layouts, 15-20% for complex patterns
            </Text>
          </View>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateTiles}
          >
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>

          {results && (
            <View style={styles.resultsContainer}>
              <Text style={styles.resultsTitle}>Results</Text>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Total Area:</Text>
                <Text style={styles.resultValue}>
                  {results.totalArea.toFixed(2)} sq m
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Tiles Needed:</Text>
                <Text style={styles.resultValue}>
                  {results.tilesNeeded} tiles
                </Text>
              </View>

              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>
                  Wastage ({wastagePercentage}%):
                </Text>
                <Text style={styles.resultValue}>
                  {results.wastageAmount} tiles
                </Text>
              </View>

              <View style={styles.resultRowTotal}>
                <Text style={styles.resultLabelTotal}>Total Tiles:</Text>
                <Text style={styles.resultValueTotal}>
                  {results.totalTiles} tiles
                </Text>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetCalculator}
              >
                <Text style={styles.resetButtonText}>Reset Calculator</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#8E8E93",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 16,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputGroup: {
    flex: 1,
    marginRight: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  unitSelector: {
    marginTop: 16,
  },
  unitOptions: {
    flexDirection: "row",
    marginTop: 8,
  },
  unitOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginRight: 12,
    borderRadius: 8,
  },
  selectedUnitOption: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  unitOptionText: {
    fontSize: 14,
    color: "#666",
  },
  selectedUnitOptionText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  tileSizesContainer: {
    flexDirection: "row",
    marginVertical: 12,
  },
  tileSizeOption: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    marginRight: 12,
    borderRadius: 8,
  },
  selectedTileSizeOption: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  tileSizeText: {
    fontSize: 14,
    color: "#666",
  },
  selectedTileSizeText: {
    color: "#007AFF",
    fontWeight: "500",
  },
  noSizesContainer: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    alignItems: "center",
  },
  noSizesText: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: "center",
  },
  wastageContainer: {
    marginBottom: 16,
  },
  wastageInput: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    width: "30%",
  },
  wastageText: {
    fontSize: 16,
    color: "#666",
    position: "absolute",
    right: "65%",
    top: 12,
  },
  wastageHelper: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  calculateButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 16,
  },
  calculateButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsContainer: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  resultLabel: {
    fontSize: 14,
    color: "#666",
  },
  resultValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  resultRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginTop: 4,
  },
  resultLabelTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  resultValueTotal: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  resetButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default InstallationCalculator;
