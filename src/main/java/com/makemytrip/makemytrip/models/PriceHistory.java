package com.makemytrip.makemytrip.models;

public class PriceHistory {

    private double price;
    private String timestamp;
    private String reason;

    public PriceHistory() {
    }

    public PriceHistory(double price, String timestamp, String reason) {
        this.price = price;
        this.timestamp = timestamp;
        this.reason = reason;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}