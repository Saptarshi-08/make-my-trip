package com.makemytrip.makemytrip.models;

import java.util.List;

public class FlightBookingRequest {

    private List<String> selectedSeats;
    private boolean savePreference;
    private boolean useFrozenPrice;
    private String frozenPriceExpiry;

    public FlightBookingRequest() {
    }

    public List<String> getSelectedSeats() {
        return selectedSeats;
    }

    public void setSelectedSeats(List<String> selectedSeats) {
        this.selectedSeats = selectedSeats;
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