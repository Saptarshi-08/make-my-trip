package com.makemytrip.makemytrip.services;

    import java.time.LocalDateTime;
    import java.util.Random;

    import org.springframework.stereotype.Service;

    import com.makemytrip.makemytrip.models.Flight;

    @Service
    public class FlightStatusService {

        private final Random random = new Random();

        private final String[] reasons = {
            "Bad Weather",
            "Air Traffic Congestion",
            "Technical Inspection",
            "Crew Availability",
            "Runway Maintenance"
        };

        public Flight generateLiveStatus(Flight flight){

            int state = random.nextInt(3);

            if(state == 0){

                flight.setFlightStatus("ON_TIME");

                flight.setDelayReason("");

                flight.setRevisedDepartureTime(null);
                flight.setRevisedArrivalTime(null);

                flight.setEstimatedArrivalTime(
                    flight.getArrivalTime()
                );
            }

            if(state == 1){

                flight.setFlightStatus("BOARDING");

                flight.setDelayReason("");

                flight.setRevisedDepartureTime(null);
                flight.setRevisedArrivalTime(null);

                flight.setEstimatedArrivalTime(
                    flight.getArrivalTime()
                );
            }

            if(state == 2){

                flight.setFlightStatus("DELAYED_BY_1_HOUR");

                flight.setDelayReason(
                    reasons[random.nextInt(reasons.length)]
                );

                LocalDateTime departure =
                    LocalDateTime.parse(
                        flight.getDepartureTime()
                    );

                LocalDateTime arrival =
                    LocalDateTime.parse(
                        flight.getArrivalTime()
                    );

                LocalDateTime revisedDeparture =
                    departure.plusHours(1);

                LocalDateTime revisedArrival =
                    arrival.plusHours(1);

                flight.setRevisedDepartureTime(
                    revisedDeparture.toString()
                );

                flight.setRevisedArrivalTime(
                    revisedArrival.toString()
                );

                flight.setEstimatedArrivalTime(
                    revisedArrival.toString()
                );
            }

            flight.setLastUpdated(
                LocalDateTime.now().toString()
            );

            return flight;
        }
}