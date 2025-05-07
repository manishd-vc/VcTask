import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useNavigation } from "expo-router";
import { TileType, RoomType } from "@/src/types";

const { width } = Dimensions.get("window");
const ITEM_WIDTH = (width - 48) / 2;

// Sample images for different categories
const TILE_TYPE_IMAGES = {
  ceramic:
    "https://images.unsplash.com/photo-1596825605376-4a4a5550140a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  porcelain:
    "https://images.unsplash.com/photo-1600607291525-f187a98dd5a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  vitrified:
    "https://images.unsplash.com/photo-1600566752355-c4ddb5d49c5a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  marble:
    "https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  granite:
    "https://images.unsplash.com/photo-1603936592559-28bea86ace7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  mosaic:
    "https://images.unsplash.com/photo-1551776222-a563ff2b1878?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  other:
    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
};

const ROOM_TYPE_IMAGES = {
  bathroom:
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  kitchen:
    "https://images.unsplash.com/photo-1584346133934-7a7b89b30e85?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  "living room":
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  bedroom:
    "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  outdoor:
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  commercial:
    "https://images.unsplash.com/photo-1572025442646-866d16c84a54?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  other:
    "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
};

export default function CategoriesScreen() {
  const navigation = useNavigation();

  const handleTileTypePress = (type: TileType) => {
    // @ts-ignore - we'll set up proper typing for navigation later
    navigation.navigate("catalog", { type });
  };

  const handleRoomTypePress = (roomType: RoomType) => {
    // @ts-ignore - we'll set up proper typing for navigation later
    navigation.navigate("catalog", { roomType });
  };

  // Tile types that we want to display
  const tileTypes: TileType[] = [
    "ceramic",
    "porcelain",
    "vitrified",
    "marble",
    "granite",
    "mosaic",
    "other",
  ];

  // Room types that we want to display
  const roomTypes: RoomType[] = [
    "bathroom",
    "kitchen",
    "living room",
    "bedroom",
    "outdoor",
    "commercial",
    "other",
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Tile Types Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tile Types</Text>
        <Text style={styles.sectionDescription}>
          Browse our wide selection of premium tiles by material type
        </Text>

        <View style={styles.grid}>
          {tileTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.categoryCard}
              onPress={() => handleTileTypePress(type)}
            >
              <Image
                source={{ uri: TILE_TYPE_IMAGES[type] }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <View style={styles.categoryOverlay} />
              <Text style={styles.categoryTitle}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Room Types Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Room</Text>
        <Text style={styles.sectionDescription}>
          Find the perfect tiles for every space in your home
        </Text>

        <View style={styles.grid}>
          {roomTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.categoryCard}
              onPress={() => handleRoomTypePress(type)}
            >
              <Image
                source={{ uri: ROOM_TYPE_IMAGES[type] }}
                style={styles.categoryImage}
                resizeMode="cover"
              />
              <View style={styles.categoryOverlay} />
              <Text style={styles.categoryTitle}>
                {type
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Special Collections Section */}
      <View style={styles.specialSection}>
        <Text style={styles.specialTitle}>Special Collections</Text>
        <Text style={styles.specialDescription}>
          Discover our curated collections for premium spaces
        </Text>

        <TouchableOpacity
          style={styles.specialBanner}
          onPress={() => {
            navigation.navigate("catalog" as never);
          }}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            }}
            style={styles.specialImage}
            resizeMode="cover"
          />
          <View style={styles.specialOverlay} />
          <View style={styles.specialContent}>
            <Text style={styles.specialName}>Premium Imported Collection</Text>
            <Text style={styles.specialSubtitle}>
              Exclusive designs from top international brands
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.specialBanner}
          onPress={() => {
            navigation.navigate("catalog" as never);
          }}
        >
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
            }}
            style={styles.specialImage}
            resizeMode="cover"
          />
          <View style={styles.specialOverlay} />
          <View style={styles.specialContent}>
            <Text style={styles.specialName}>Eco-Friendly Tiles</Text>
            <Text style={styles.specialSubtitle}>
              Sustainable and environmentally conscious options
            </Text>
          </View>
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
  section: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: "#F2F2F7",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryCard: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  categoryTitle: {
    position: "absolute",
    bottom: 16,
    left: 16,
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  specialSection: {
    padding: 16,
    paddingBottom: 32,
  },
  specialTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  specialDescription: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 16,
  },
  specialBanner: {
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    position: "relative",
  },
  specialImage: {
    width: "100%",
    height: "100%",
  },
  specialOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  specialContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  specialName: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  specialSubtitle: {
    color: "#FFFFFF",
    fontSize: 14,
    opacity: 0.9,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
