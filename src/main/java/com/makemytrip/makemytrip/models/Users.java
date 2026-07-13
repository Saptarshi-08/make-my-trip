package com.makemytrip.makemytrip.models;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.ArrayList;
import java.time.LocalDateTime;

@Document(collection = "users")
public class Users {
    @Id
    private String _id;
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String role;
    private String phoneNumber;
    private String preferredSeatType;
    private String preferredRoomType;
    private List<Booking> bookings = new ArrayList<>();;


    public String getFirstName() {return firstName;}
    public String getId() {
        return _id;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    public String getLastName() {
        return lastName;
    }
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    public String getPhoneNumber() {
        return phoneNumber;
    }
    public String getPassword() {return password;}
    public String getEmail() {return email;}
    public String getRole() {return role;}
    public void setPassword(String password) {this.password = password;}
    public void setRole(String role) {this.role = role;}
    public String getPreferredSeatType() {
        return preferredSeatType;
    }

    public void setPreferredSeatType(String preferredSeatType) {
        this.preferredSeatType = preferredSeatType;
    }

    public String getPreferredRoomType() {
        return preferredRoomType;
    }

    public void setPreferredRoomType(String preferredRoomType) {
        this.preferredRoomType = preferredRoomType;
    }
    public List<Booking> getBookings(){return bookings;}
    public void setBookings(List<Booking> bookings){this.bookings=bookings;}


    public static class Booking{
        private String type;
        private String bookingId;

        private LocalDateTime bookingTime;

        private int quantity;
        private double totalPrice;

        private String bookingStatus;
        private String cancellationReason;
        private double refundAmount;
        private String refundStatus;
        private LocalDateTime cancellationTime;

        private String flightId;
        private String flightName;
        private String fromLocation;
        private String toLocation;

        private String hotelId;
        private String hotelName;
        private String hotelLocation;

        private List<String> selectedSeats = new ArrayList<>();
        private String roomType;
        private boolean savePreference = false;

        // Getters and Setters
        public String getType() {
            return type;
        }

        public void setType(String type) {
            this.type = type;
        }

        public String getBookingId() {
            return bookingId;
        }

        public void setBookingId(String bookingId) {
            this.bookingId = bookingId;
        }

        public LocalDateTime getBookingTime() {
            return bookingTime;
        }

        public void setBookingTime(LocalDateTime bookingTime) {
            this.bookingTime = bookingTime;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }

        public double getTotalPrice() {
            return totalPrice;
        }

        public void setTotalPrice(double totalPrice) {
            this.totalPrice = totalPrice;
        }

        public String getBookingStatus() {
            return bookingStatus;
        }

        public void setBookingStatus(String bookingStatus) {
            this.bookingStatus = bookingStatus;
        }

        public String getCancellationReason() {
            return cancellationReason;
        }

        public void setCancellationReason(String cancellationReason) {
            this.cancellationReason = cancellationReason;
        }

        public double getRefundAmount() {
            return refundAmount;
        }

        public void setRefundAmount(double refundAmount) {
            this.refundAmount = refundAmount;
        }

        public String getRefundStatus() {
            return refundStatus;
        }

        public void setRefundStatus(String refundStatus) {
            this.refundStatus = refundStatus;
        }

        public LocalDateTime getCancellationTime() {
            return cancellationTime;
        }

        public void setCancellationTime(LocalDateTime cancellationTime) {
            this.cancellationTime = cancellationTime;
        }

        public String getFlightId() {
            return flightId;
        }

        public void setFlightId(String flightId) {
            this.flightId = flightId;
        }

        public String getFlightName() {
            return flightName;
        }

        public void setFlightName(String flightName) {
            this.flightName = flightName;
        }

        public String getFromLocation() {
            return fromLocation;
        }

        public void setFromLocation(String fromLocation) {
            this.fromLocation = fromLocation;
        }

        public String getToLocation() {
            return toLocation;
        }

        public void setToLocation(String toLocation) {
            this.toLocation = toLocation;
        }

        public String getHotelId() {
            return hotelId;
        }

        public void setHotelId(String hotelId) {
            this.hotelId = hotelId;
        }

        public String getHotelName() {
            return hotelName;
        }

        public void setHotelName(String hotelName) {
            this.hotelName = hotelName;
        }

        public String getHotelLocation() {
            return hotelLocation;
        }

        public void setHotelLocation(String hotelLocation) {
            this.hotelLocation = hotelLocation;
        }

        public List<String> getSelectedSeats() {
            return selectedSeats;
        }

        public void setSelectedSeats(List<String> selectedSeats) {
            this.selectedSeats = selectedSeats;
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
    }
}