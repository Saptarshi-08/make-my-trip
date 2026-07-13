package com.makemytrip.makemytrip.models;

public class HotelBookingRequest {

    private String roomType;
    private boolean savePreference;
    private boolean useFrozenPrice;
    private String frozenPriceExpiry;

    public HotelBookingRequest() {
    }

    public String getRoomType() {
        return roomType;
    }

    public void setRoomType(String roomType) {
        this.roomType = roomType;
    }

    public boolean isSavePreference() {
        return savePreference;
    }

    public void setSavePreference(boolean savePreference) {
        this.savePreference = savePreference;
    }

    public boolean isUseFrozenPrice() {
        return useFrozenPrice;
    }

    public void setUseFrozenPrice(boolean useFrozenPrice) {
        this.useFrozenPrice = useFrozenPrice;
    }

    public String getFrozenPriceExpiry() {
        return frozenPriceExpiry;
    }

    public void setFrozenPriceExpiry(String frozenPriceExpiry) {
        this.frozenPriceExpiry = frozenPriceExpiry;
    }
}