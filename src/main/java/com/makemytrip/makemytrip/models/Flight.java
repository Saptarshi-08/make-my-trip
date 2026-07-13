package com.makemytrip.makemytrip.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.ArrayList;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

@Document(collection = "flight")
public class Flight {
    @Id
    private String _id;
    private String flightName;
    private String from;
    private String to;
    private String departureTime;
    private String arrivalTime;
    private double price;
    private int availableSeats = 180;
    private double averageRating = 0.0;
    private int reviewCount = 0;
    private String flightStatus = "ON_TIME";
    private String delayReason = "";
    private String revisedDepartureTime;
    private String revisedArrivalTime;
    private String estimatedArrivalTime;
    private String lastUpdated;
    private int seatRows = 30;
    private int seatColumns = 6;
    private List<String> bookedSeats = new ArrayList<>();
    private double basePrice;
    private double currentPrice;
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

    public String getFlightName() {
        return flightName;
    }

    public void setFlightName(String flightName) {
        this.flightName = flightName;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
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

    public String getFlightStatus() {
        return flightStatus;
    }

    public void setFlightStatus(String flightStatus) {
        this.flightStatus = flightStatus;
    }

    public String getDelayReason() {
        return delayReason;
    }

    public void setDelayReason(String delayReason) {
        this.delayReason = delayReason;
    }

    public String getRevisedDepartureTime() {
        return revisedDepartureTime;
    }

    public void setRevisedDepartureTime(String revisedDepartureTime) {
        this.revisedDepartureTime = revisedDepartureTime;
    }

    public String getRevisedArrivalTime() {
        return revisedArrivalTime;
    }

    public void setRevisedArrivalTime(String revisedArrivalTime) {
        this.revisedArrivalTime = revisedArrivalTime;
    }

    public String getEstimatedArrivalTime() {
        return estimatedArrivalTime;
    }

    public void setEstimatedArrivalTime(String estimatedArrivalTime) {
        this.estimatedArrivalTime = estimatedArrivalTime;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public int getSeatRows() {
        return seatRows;
    }

    public void setSeatRows(int seatRows) {
        this.seatRows = seatRows;
    }

    public int getSeatColumns() {
        return seatColumns;
    }

    public void setSeatColumns(int seatColumns) {
        this.seatColumns = seatColumns;
    }

    public List<String> getBookedSeats() {
        return bookedSeats;
    }

    public void setBookedSeats(List<String> bookedSeats) {
        this.bookedSeats = bookedSeats;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public double getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(double currentPrice) {
        this.currentPrice = currentPrice;
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
}