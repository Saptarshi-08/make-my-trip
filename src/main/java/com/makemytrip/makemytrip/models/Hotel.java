package com.makemytrip.makemytrip.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "hotels")
public class Hotel {
    @Id
    private String _id;
    private String hotelName;
    private String location;
    private double pricePerNight;
    private String amenities;
    private double averageRating = 0.0;
    private int reviewCount = 0;
    private List<RoomType> roomTypes = new ArrayList<>();
    private double basePricePerNight;
    private double currentPricePerNight;
    private boolean dynamicPricingEnabled = true;
    private List<PriceHistory> priceHistory = new ArrayList<>();
    private Map<String, Double> frozenPrices = new HashMap<>();
    private Map<String, String> frozenPriceExpiry = new HashMap<>();
    private String pricingReason = "";

    // Getters and Setters
    public String getId() {
        return _id;
    }

    public void setId(String id) {
        this._id = id;
    }

    public void setAmenities(String amenities) {
        this.amenities = amenities;
    }

    public String getAmenities() {
        return amenities;
    }

    public String getHotelName() {
        return hotelName;
    }

    public void setHotelName(String hotelName) {
        this.hotelName = hotelName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public double getPricePerNight() {
        return pricePerNight;
    }

    public void setPricePerNight(double pricePerNight) {
        this.pricePerNight = pricePerNight;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    public List<RoomType> getRoomTypes() {
        return roomTypes;
    }

    public void setRoomTypes(List<RoomType> roomTypes) {
        this.roomTypes = roomTypes;
    }

    public double getBasePricePerNight() {
        return basePricePerNight;
    }

    public void setBasePricePerNight(double basePricePerNight) {
        this.basePricePerNight = basePricePerNight;
    }

    public double getCurrentPricePerNight() {
        return currentPricePerNight;
    }

    public void setCurrentPricePerNight(double currentPricePerNight) {
        this.currentPricePerNight = currentPricePerNight;
    }

    public boolean isDynamicPricingEnabled() {
        return dynamicPricingEnabled;
    }

    public void setDynamicPricingEnabled(boolean dynamicPricingEnabled) {
        this.dynamicPricingEnabled = dynamicPricingEnabled;
    }

    public List<PriceHistory> getPriceHistory() {
        return priceHistory;
    }

    public void setPriceHistory(List<PriceHistory> priceHistory) {
        this.priceHistory = priceHistory;
    }

    public Map<String, Double> getFrozenPrices() {
        return frozenPrices;
    }

    public void setFrozenPrices(Map<String, Double> frozenPrices) {
        this.frozenPrices = frozenPrices;
    }

    public Map<String, String> getFrozenPriceExpiry() {
        return frozenPriceExpiry;
    }

    public void setFrozenPriceExpiry(Map<String, String> frozenPriceExpiry) {
        this.frozenPriceExpiry = frozenPriceExpiry;
    }

    public String getPricingReason() {
        return pricingReason;
    }

    public void setPricingReason(String pricingReason) {
        this.pricingReason = pricingReason;
    }

    public static class RoomType {

        private String type;

        private double price;

        private int available;

        private double upgradeCharge;

        private List<String> images = new ArrayList<>();

        private String description;

        // Getters and Setters

        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public double getPrice() {
            return price;
        }

        public void setPrice(double price) {
            this.price = price;
        }

        public int getAvailable() {
            return available;
        }

        public void setAvailable(int available) {
            this.available = available;
        }

        public double getUpgradeCharge() {
            return upgradeCharge;
        }

        public void setUpgradeCharge(double upgradeCharge) {
            this.upgradeCharge = upgradeCharge;
        }

        public List<String> getImages() {
            return images;
        }

        public void setImages(List<String> images) {
            this.images = images;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }
}