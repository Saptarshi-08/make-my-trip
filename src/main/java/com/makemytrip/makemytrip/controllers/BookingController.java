package com.makemytrip.makemytrip.controllers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.makemytrip.makemytrip.models.Users;
import com.makemytrip.makemytrip.services.BookingService;
import com.makemytrip.makemytrip.repositories.FlightRepository;
import com.makemytrip.makemytrip.repositories.HotelRepository;
import com.makemytrip.makemytrip.models.FlightBookingRequest;
import com.makemytrip.makemytrip.models.HotelBookingRequest;
import com.makemytrip.makemytrip.models.PriceHistory;
import java.util.List;

@RestController
@RequestMapping("/booking")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @PostMapping("/flight")
    public Users.Booking bookFlight(
        @RequestParam String userId,
        @RequestParam String flightId,
        @RequestBody FlightBookingRequest request
    ) {

        return bookingService.bookFlight(
            userId,
            flightId,
            request
        );
    }

    @PostMapping("/hotel")
    public Users.Booking bookhotel(
        @RequestParam String userId,
        @RequestParam String hotelId,
        @RequestBody HotelBookingRequest request
    ){

        return bookingService.bookhotel(
            userId,
            hotelId,
            request
        );
    }
    @PostMapping("/cancel")
    public ResponseEntity<?> cancelBooking(
            @RequestParam String userId,
            @RequestParam String bookingId,
            @RequestParam String reason
    ) {

        return ResponseEntity.ok(
                bookingService.cancelBooking(
                        userId,
                        bookingId,
                        reason
                )
        );
    }
    @PostMapping("/refund-status")
    public ResponseEntity<?> updateRefundStatus(
            @RequestParam String userId,
            @RequestParam String bookingId,
            @RequestParam String status
    ) {

        return ResponseEntity.ok(
                bookingService.updateRefundStatus(
                        userId,
                        bookingId,
                        status
                )
        );
    }
    @GetMapping("/flight/current-price")
    public ResponseEntity<Double> getCurrentFlightPrice(
            @RequestParam String flightId
    ) {

        return ResponseEntity.ok(
                bookingService.getCurrentFlightPrice(flightId)
        );
    }
    @GetMapping("/hotel/current-price")
    public ResponseEntity<Double> getCurrentHotelPrice(
            @RequestParam String hotelId
    ) {

        return ResponseEntity.ok(
                bookingService.getCurrentHotelPrice(hotelId)
        );
    }
    @GetMapping("/flight/price-history")
    public ResponseEntity<List<PriceHistory>> getFlightPriceHistory(
            @RequestParam String flightId
    ) {

        return ResponseEntity.ok(
                bookingService.getFlightPriceHistory(flightId)
        );
    }
    @GetMapping("/hotel/price-history")
    public ResponseEntity<List<PriceHistory>> getHotelPriceHistory(
            @RequestParam String hotelId
    ) {

        return ResponseEntity.ok(
                bookingService.getHotelPriceHistory(hotelId)
        );
    }
    @PostMapping("/flight/freeze-price")
    public ResponseEntity<String> freezeFlightPrice(
            @RequestParam String userId,
            @RequestParam String flightId
    ) {

        bookingService.freezeFlightPrice(userId, flightId);

        return ResponseEntity.ok(
        flightRepository
                .findById(flightId)
                .get()
                .getFrozenPriceExpiry()
                .get(userId)
        );
    }
    @GetMapping("/flight/frozen-price")
        public ResponseEntity<?> getFrozenFlightPrice(
                @RequestParam String userId,
                @RequestParam String flightId
        ) {

        return ResponseEntity.ok(
                bookingService.getFrozenFlightPrice(
                        userId,
                        flightId
                )
        );
        }
    @PostMapping("/hotel/freeze-price")
    public ResponseEntity<String> freezeHotelPrice(
            @RequestParam String userId,
            @RequestParam String hotelId
    ) {

        bookingService.freezeHotelPrice(userId, hotelId);

        return ResponseEntity.ok(
        hotelRepository
                .findById(hotelId)
                .get()
                .getFrozenPriceExpiry()
                .get(userId)
        );
    }
    @GetMapping("/hotel/frozen-price")
    public ResponseEntity<?> getFrozenHotelPrice(
        @RequestParam String userId,
        @RequestParam String hotelId
        ) {
                return ResponseEntity.ok(
                        bookingService.getFrozenHotelPrice( userId, hotelId )
                );
        }
}