package com.makemytrip.makemytrip.services;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.models.Users.Booking;
import com.makemytrip.makemytrip.models.Flight;
import com.makemytrip.makemytrip.models.Hotel;
import com.makemytrip.makemytrip.repositories.UserRepository;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.makemytrip.makemytrip.models.FlightBookingRequest;
import com.makemytrip.makemytrip.models.HotelBookingRequest;
import java.util.List;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.time.LocalTime;
import com.makemytrip.makemytrip.models.PriceHistory;
import java.time.MonthDay;
import java.util.Set;
import java.util.HashSet;

@Service
public class BookingService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    private static final Set<MonthDay> HOLIDAYS = new HashSet<>(
        java.util.Arrays.asList(
                MonthDay.of(1, 1),    // New Year
                MonthDay.of(2, 14),   // Valentine's Day
                MonthDay.of(8, 15),   // Independence Day
                MonthDay.of(10, 2),   // Gandhi Jayanti
                MonthDay.of(12, 25)   // Christmas
        )
    );

    private double calculateFlightPriceOnly(Flight flight, int seats) {

        double basePrice = flight.getBasePrice() > 0
                ? flight.getBasePrice()
                : flight.getPrice();

        double multiplier = 1.0;
        StringBuilder reason = new StringBuilder();

        LocalDate today = LocalDate.now();

        // Weekend Pricing (+10%)
        if (today.getDayOfWeek() == DayOfWeek.SATURDAY ||
                today.getDayOfWeek() == DayOfWeek.SUNDAY) {

            multiplier += 0.10;
            reason.append("Weekend ");
        }

        // Holiday Pricing (+20%)
        if (HOLIDAYS.contains(MonthDay.from(today))) {

            multiplier += 0.20;
            reason.append("Holiday ");
        }

        // Peak Hours (+5%)
        LocalTime now = LocalTime.now();

        if (now.isAfter(LocalTime.of(18, 0))) {

            multiplier += 0.05;
            reason.append("Peak Hour ");
        }

        // High Demand (+15%)
        double occupancy =
                (double) flight.getBookedSeats().size() /
                (flight.getSeatRows() * flight.getSeatColumns());

        if (occupancy >= 0.75) {

            multiplier += 0.15;
            reason.append("High Demand ");
        }

        // Seasonal Pricing
        int month = today.getMonthValue();

        if (month >= 4 && month <= 6) {
            multiplier += 0.10;
            reason.append("Summer Season ");
        } else if (month >= 10 && month <= 11) {
            multiplier += 0.08;
            reason.append("Festive Season ");
        } else if (month == 12) {
            multiplier += 0.12;
            reason.append("Winter Travel ");
        }

        // Live Demand Simulation (changes every 5 minutes)
        int fiveMinuteSlot = LocalTime.now().getMinute() / 5;

        double fluctuation =
                (fiveMinuteSlot % 3 == 0)
                        ? 0.03
                        : (fiveMinuteSlot % 3 == 1)
                        ? -0.02
                        : 0.01;

        multiplier += fluctuation;

        if (fluctuation > 0) {
            reason.append("Live Demand ");
        } else {
            reason.append("Limited Offer ");
        }

        double finalPrice = basePrice * multiplier;

        flight.setCurrentPrice(finalPrice);

        flight.setPricingReason(
        reason.length() == 0
                ? "Standard Pricing"
                : "Price adjusted due to: " + reason.toString().trim());

        boolean shouldSaveHistory = true;

        if (!flight.getPriceHistory().isEmpty()) {

            PriceHistory lastEntry =
                    flight.getPriceHistory()
                            .get(flight.getPriceHistory().size() - 1);

            if (Math.abs(lastEntry.getPrice() - finalPrice) < 0.01) {
                shouldSaveHistory = false;
            }
        }

        if (shouldSaveHistory) {

            flight.getPriceHistory().add(
                    new PriceHistory(
                            finalPrice,
                            LocalDateTime.now().toString(),
                            flight.getPricingReason()
                    ));
        }

        flightRepository.save(flight);

        return finalPrice * seats;
    }

    private double calculateFlightPrice(Flight flight, int seats) {

        double newPrice = calculateFlightPriceOnly(flight, seats);

        boolean shouldSaveHistory = true;

        if (!flight.getPriceHistory().isEmpty()) {

            PriceHistory last =
                    flight.getPriceHistory()
                            .get(flight.getPriceHistory().size() - 1);

            if (Math.abs(last.getPrice() - newPrice / seats) < 0.01) {
                shouldSaveHistory = false;
            }
        }

        if (shouldSaveHistory) {

            flight.setCurrentPrice(newPrice / seats);

            flight.getPriceHistory().add(
                    new PriceHistory(
                            newPrice / seats,
                            LocalDateTime.now().toString(),
                            flight.getPricingReason()
                    )
            );

            flightRepository.save(flight);
        }

        return newPrice;
    }

    private double calculateHotelPriceOnly(Hotel hotel) {

        double basePrice =
                hotel.getBasePricePerNight() > 0 ?
                        hotel.getBasePricePerNight() :
                        hotel.getPricePerNight();

        double multiplier = 1.0;

        StringBuilder reason = new StringBuilder();

        LocalDate today = LocalDate.now();

        if (today.getDayOfWeek() == DayOfWeek.SATURDAY ||
                today.getDayOfWeek() == DayOfWeek.SUNDAY) {

            multiplier += 0.10;
            reason.append("Weekend ");
        }
        // Holiday Pricing (+20%)
        if (HOLIDAYS.contains(MonthDay.from(today))) {

            multiplier += 0.20;
            reason.append("Holiday ");
        }

        int totalRooms = 0;
        int bookedRooms = 0;

        for (Hotel.RoomType room : hotel.getRoomTypes()) {

            totalRooms += room.getAvailable();
        }

        bookedRooms = Math.max(0, 100 - totalRooms);

        if ((double) bookedRooms / 100 >= 0.70) {

            multiplier += 0.15;
            reason.append("High Demand ");
        }
        // Seasonal Pricing
        int month = today.getMonthValue();

        if (month >= 4 && month <= 6) {

            multiplier += 0.10;
            reason.append("Summer Season ");

        } else if (month >= 10 && month <= 11) {

            multiplier += 0.08;
            reason.append("Festive Season ");

        } else if (month == 12) {

            multiplier += 0.12;
            reason.append("Winter Travel ");
        }

        // Live Demand Simulation (changes every 5 minutes)
        int fiveMinuteSlot = LocalTime.now().getMinute() / 5;

        double fluctuation =
                (fiveMinuteSlot % 3 == 0)
                        ? 0.03
                        : (fiveMinuteSlot % 3 == 1)
                        ? -0.02
                        : 0.01;

        multiplier += fluctuation;

        if (fluctuation > 0) {

            reason.append("Live Demand ");

        } else {

            reason.append("Limited Offer ");
        }

        double finalPrice = basePrice * multiplier;

        hotel.setCurrentPricePerNight(finalPrice);

        hotel.setPricingReason(
        reason.length() == 0
                ? "Standard Pricing"
                : "Price adjusted due to: " + reason.toString().trim());

        boolean shouldSaveHistory = true;

        if (!hotel.getPriceHistory().isEmpty()) {

            PriceHistory lastEntry =
                    hotel.getPriceHistory()
                            .get(hotel.getPriceHistory().size() - 1);

            if (Math.abs(lastEntry.getPrice() - finalPrice) < 0.01) {
                shouldSaveHistory = false;
            }
        }

        if (shouldSaveHistory) {

            hotel.getPriceHistory().add(
                    new PriceHistory(
                            finalPrice,
                            LocalDateTime.now().toString(),
                            hotel.getPricingReason()
                    ));
        }

        hotelRepository.save(hotel);

        return finalPrice;
    }

    private double calculateHotelPrice(Hotel hotel) {

        double newPrice = calculateHotelPriceOnly(hotel);

        boolean shouldSaveHistory = true;

        if (!hotel.getPriceHistory().isEmpty()) {

            PriceHistory last =
                    hotel.getPriceHistory()
                            .get(hotel.getPriceHistory().size() - 1);

            if (Math.abs(last.getPrice() - newPrice) < 0.01) {
                shouldSaveHistory = false;
            }
        }

        if (shouldSaveHistory) {

            hotel.setCurrentPricePerNight(newPrice);

            hotel.getPriceHistory().add(
                    new PriceHistory(
                            newPrice,
                            LocalDateTime.now().toString(),
                            hotel.getPricingReason()
                    )
            );

            hotelRepository.save(hotel);
        }

        return newPrice;
    }

    public Booking bookFlight(
        String userId,
        String flightId,
        FlightBookingRequest request) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() ->
                        new RuntimeException("Flight not found"));

        List<String> selectedSeats = request.getSelectedSeats();
        if (selectedSeats.size() > flight.getAvailableSeats()) {

            throw new RuntimeException(
                    "Not enough seats available.");

        }

        if (selectedSeats == null || selectedSeats.isEmpty()) {
            throw new RuntimeException("Please select at least one seat.");
        }

        // Check if any selected seat is already booked
        for (String seat : selectedSeats) {

            char letter =
                    seat.charAt(seat.length() - 1);

            int row =
                    Integer.parseInt(
                            seat.substring(
                                    0,
                                    seat.length() - 1));

            if (row < 1 ||
                    row > flight.getSeatRows()) {

                throw new RuntimeException(
                        "Invalid seat number : "
                                + seat);
            }

            if (letter < 'A' ||
                    letter > 'F') {

                throw new RuntimeException(
                        "Invalid seat number : "
                                + seat);
            }

            if (flight.getBookedSeats()
                    .contains(seat)) {

                throw new RuntimeException(
                        "Seat "
                                + seat
                                + " already booked.");
            }

        }

        // Mark seats as booked
        flight.getBookedSeats().addAll(selectedSeats);

        // Update available seats
        flight.setAvailableSeats(
                flight.getSeatRows() *
                flight.getSeatColumns() -
                flight.getBookedSeats().size()
        );

        flightRepository.save(flight);

        Booking booking = new Booking();

        booking.setType("Flight");
        booking.setBookingId(UUID.randomUUID().toString());

        booking.setFlightId(flight.getId());
        booking.setFlightName(flight.getFlightName());
        booking.setFromLocation(flight.getFrom());
        booking.setToLocation(flight.getTo());

        booking.setBookingTime(LocalDateTime.now());

        booking.setQuantity(selectedSeats.size());

        booking.setSelectedSeats(selectedSeats);

        double finalPrice;

        if (request.isUseFrozenPrice()
                && flight.getFrozenPrices().containsKey(userId)
                && flight.getFrozenPriceExpiry().containsKey(userId)
                && LocalDateTime.now().isBefore(
                        LocalDateTime.parse(
                                flight.getFrozenPriceExpiry().get(userId)))) {

            finalPrice = flight.getFrozenPrices().get(userId);

        } else {

            finalPrice = calculateFlightPrice(
                    flight,
                    selectedSeats.size());
        }

        booking.setTotalPrice(finalPrice);

        booking.setBookingStatus("ACTIVE");
        booking.setRefundAmount(0);
        booking.setRefundStatus("NA");
        booking.setCancellationReason(null);
        booking.setCancellationTime(null);

        // Save user's preferred seat type
        if (request.isSavePreference()) {

            int windowCount = 0;
            int middleCount = 0;
            int aisleCount = 0;

            for (String seat : selectedSeats) {

                char seatLetter = seat.charAt(seat.length() - 1);

                if (seatLetter == 'A' || seatLetter == 'F') {

                    windowCount++;

                } else if (seatLetter == 'C' || seatLetter == 'D') {

                    aisleCount++;

                } else {

                    middleCount++;

                }
            }

            if (windowCount >= middleCount && windowCount >= aisleCount) {

                user.setPreferredSeatType("WINDOW");

            } else if (aisleCount >= windowCount && aisleCount >= middleCount) {

                user.setPreferredSeatType("AISLE");

            } else {

                user.setPreferredSeatType("MIDDLE");

            }

        }

        user.getBookings().add(booking);

        userRepository.save(user);
        // System.out.println("Saved preferredSeatType = " + user.getPreferredSeatType());
        return booking;
    }

    public Booking bookhotel(
        String userId,
        String hotelId,
        HotelBookingRequest request) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() ->
                        new RuntimeException("Hotel not found"));

        Hotel.RoomType room = hotel.getRoomTypes()
                .stream()
                .filter(r -> r.getType().equals(request.getRoomType()))
                .findFirst()
                .orElseThrow(() ->
                        new RuntimeException("Room type not found"));

        if (room == null) {

            throw new RuntimeException(
                    "Invalid room type.");

        }

        if (room.getAvailable() <= 0) {
            throw new RuntimeException(
                    "Selected room type is sold out.");
        }

        room.setAvailable(room.getAvailable() - 1);

        hotelRepository.save(hotel);

        Booking booking = new Booking();

        booking.setType("Hotel");
        booking.setBookingId(UUID.randomUUID().toString());

        booking.setHotelId(hotel.getId());
        booking.setHotelName(hotel.getHotelName());
        booking.setHotelLocation(hotel.getLocation());

        booking.setRoomType(room.getType());

        booking.setBookingTime(LocalDateTime.now());

        booking.setQuantity(1);

        double finalPrice;

        if (request.isUseFrozenPrice()
                && hotel.getFrozenPrices().containsKey(userId)
                && hotel.getFrozenPriceExpiry().containsKey(userId)
                && LocalDateTime.now().isBefore(
                        LocalDateTime.parse(
                                hotel.getFrozenPriceExpiry().get(userId)))) {

            finalPrice = hotel.getFrozenPrices().get(userId);

        } else {

            finalPrice = calculateHotelPrice(hotel);
        }

        booking.setTotalPrice(finalPrice);

        booking.setBookingStatus("ACTIVE");
        booking.setRefundAmount(0);
        booking.setRefundStatus("NA");
        booking.setCancellationReason(null);
        booking.setCancellationTime(null);

        if (request.isSavePreference()) {
            user.setPreferredRoomType(room.getType());
        }

        user.getBookings().add(booking);

        userRepository.save(user);

        return booking;
    }
    
    public Booking cancelBooking(
        String userId,
        String bookingId,
        String reason
    ) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        for (Booking booking : user.getBookings()) {

            if (booking.getBookingId().equals(bookingId)) {

                if ("CANCELLED".equals(
                    booking.getBookingStatus())) {

                    throw new RuntimeException(
                            "Booking already cancelled.");
                }

                Duration duration =
                        Duration.between(
                                booking.getBookingTime(),
                                LocalDateTime.now());

                double refundPercentage;

                if (duration.toHours() <= 24) {
                    refundPercentage = 0.50;
                } else {
                    refundPercentage = 0.25;
                }

                double refundAmount =
                        booking.getTotalPrice()
                                * refundPercentage;

                booking.setBookingStatus("CANCELLED");

                booking.setCancellationReason(reason);

                booking.setCancellationTime(
                        LocalDateTime.now());

                booking.setRefundAmount(refundAmount);

                booking.setRefundStatus("PENDING");

                /*
                * Restore Flight Seats
                */
                if ("Flight".equals(booking.getType())) {

                    Flight flight = flightRepository.findById(
                            booking.getFlightId())
                            .orElse(null);

                    if (flight != null) {

                        flight.getBookedSeats().removeAll(
                                booking.getSelectedSeats());

                        flight.setAvailableSeats(
                                flight.getSeatRows() *
                                flight.getSeatColumns() -
                                flight.getBookedSeats().size());

                        flightRepository.save(flight);
                    }
                }

                /*
                * Restore Hotel Room
                */
                if ("Hotel".equals(booking.getType())) {

                    Hotel hotel = hotelRepository.findById(
                            booking.getHotelId())
                            .orElse(null);

                    if (hotel != null) {

                        for (Hotel.RoomType room : hotel.getRoomTypes()) {

                            if (room.getType().equals(
                                    booking.getRoomType())) {

                                room.setAvailable(
                                        room.getAvailable() + 1);

                                break;
                            }
                        }

                        hotelRepository.save(hotel);
                    }
                }

                userRepository.save(user);

                return booking;
            }
        }

        throw new RuntimeException(
                "Booking not found");
    }

    public Booking updateRefundStatus(
        String userId,
        String bookingId,
        String status
    ) {

        Users user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        for (Booking booking : user.getBookings()) {

            if (booking.getBookingId().equals(bookingId)) {

                if (!status.equals("PENDING")
                        && !status.equals("PROCESSED")
                        && !status.equals("COMPLETED")) {

                    throw new RuntimeException(
                            "Invalid refund status.");

                }

                booking.setRefundStatus(status);

                userRepository.save(user);

                return booking;
            }
        }

        throw new RuntimeException(
                "Booking not found");
    }

    public double getCurrentFlightPrice(String flightId) {

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        return calculateFlightPriceOnly(flight, 1);
    }

    public double getCurrentHotelPrice(String hotelId) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        return calculateHotelPriceOnly(hotel);
    }

    public java.util.List<PriceHistory> getFlightPriceHistory(String flightId) {

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        return flight.getPriceHistory();
    }

    public java.util.List<PriceHistory> getHotelPriceHistory(String hotelId) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        return hotel.getPriceHistory();
    }

    public void freezeFlightPrice(String userId, String flightId) {

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        double currentPrice = calculateFlightPrice(flight, 1);

        flight.getFrozenPrices().put(userId, currentPrice);

        flight.getFrozenPriceExpiry().put(
                userId,
                LocalDateTime.now().plusMinutes(15).toString()
        );

        flightRepository.save(flight);
    }

    public java.util.Map<String, Object> getFrozenFlightPrice(
        String userId,
        String flightId
    ) {

        Flight flight = flightRepository.findById(flightId)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        java.util.Map<String, Object> response = new java.util.HashMap<>();

        if (!flight.getFrozenPrices().containsKey(userId)
                || !flight.getFrozenPriceExpiry().containsKey(userId)) {

            response.put("active", false);
            return response;
        }

        LocalDateTime expiry = LocalDateTime.parse(
                flight.getFrozenPriceExpiry().get(userId));

        if (LocalDateTime.now().isAfter(expiry)) {

            flight.getFrozenPrices().remove(userId);
            flight.getFrozenPriceExpiry().remove(userId);

            flightRepository.save(flight);

            response.put("active", false);
            return response;
        }

        response.put("active", true);
        response.put("price", flight.getFrozenPrices().get(userId));
        response.put("expiry", expiry.toString());

        return response;
    }

    public void freezeHotelPrice(String userId, String hotelId) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        double currentPrice = calculateHotelPrice(hotel);

        hotel.getFrozenPrices().put(userId, currentPrice);

        hotel.getFrozenPriceExpiry().put(
                userId,
                LocalDateTime.now().plusMinutes(15).toString()
        );

        hotelRepository.save(hotel);
    }

    public java.util.Map<String, Object> getFrozenHotelPrice(
        String userId,
        String hotelId
    ) {

        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));

        java.util.Map<String, Object> response = new java.util.HashMap<>();

        if (!hotel.getFrozenPrices().containsKey(userId)
                || !hotel.getFrozenPriceExpiry().containsKey(userId)) {

            response.put("active", false);
            return response;
        }

        LocalDateTime expiry = LocalDateTime.parse(
                hotel.getFrozenPriceExpiry().get(userId));

        if (LocalDateTime.now().isAfter(expiry)) {

            hotel.getFrozenPrices().remove(userId);
            hotel.getFrozenPriceExpiry().remove(userId);

            hotelRepository.save(hotel);

            response.put("active", false);
            return response;
        }

        response.put("active", true);
        response.put("price", hotel.getFrozenPrices().get(userId));
        response.put("expiry", expiry.toString());

        return response;
    }
}