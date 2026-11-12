using Application.Common;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class BookingService : IBookingService
{
    private readonly IRepository<Booking> _bookingRepo;
    private readonly IRepository<Flight> _flightRepo;
    private readonly IRepository<Tour> _tourRepo;
    private readonly IRepository<Passenger> _passengerRepo;
    private readonly IRepository<SeatAssignment> _seatAssignmentRepo;
    private readonly IRepository<Seat> _seatRepo;
    private readonly IRepository<Payment> _paymentRepo;
    private readonly IRepository<Airport> _airportRepo;

    public BookingService(
        IRepository<Booking> bookingRepo,
        IRepository<Flight> flightRepo,
        IRepository<Tour> tourRepo,
        IRepository<Passenger> passengerRepo,
        IRepository<SeatAssignment> seatAssignmentRepo,
        IRepository<Seat> seatRepo,
        IRepository<Payment> paymentRepo,
        IRepository<Airport> airportRepo)
    {
        _bookingRepo = bookingRepo;
        _flightRepo = flightRepo;
        _tourRepo = tourRepo;
        _passengerRepo = passengerRepo;
        _seatAssignmentRepo = seatAssignmentRepo;
        _seatRepo = seatRepo;
        _paymentRepo = paymentRepo;
        _airportRepo = airportRepo;
    }

    public async Task<ApiResponse<BookingDto>> CreateBookingAsync(CreateBookingDto dto, int? userId = null)
    {
        // 1. Resolve Flight
        int flightId = 1;
        if (!string.IsNullOrWhiteSpace(dto.DepartureId) && int.TryParse(dto.DepartureId, out int parsedFlightId))
        {
            flightId = parsedFlightId;
        }

        var flight = await _flightRepo.GetByIdAsync(flightId);
        if (flight == null)
        {
            var allFlights = await _flightRepo.GetAllAsync();
            flight = allFlights.FirstOrDefault();
            if (flight == null)
                return ApiResponse<BookingDto>.Fail("No flights available for booking.");
            flightId = flight.Id;
        }

        int totalSeatsRequested = Math.Max(1, dto.AdultsCount + dto.ChildrenCount);

        // Anti-overbooking check
        if (flight.SeatsAvailable < totalSeatsRequested)
        {
            return ApiResponse<BookingDto>.Fail($"Flight only has {flight.SeatsAvailable} seats remaining.");
        }

        // 2. Resolve Tour
        int? tourId = null;
        string tourTitle = "Custom Flight Slot";
        if (!string.IsNullOrWhiteSpace(dto.TourId) && int.TryParse(dto.TourId, out int parsedTourId))
        {
            tourId = parsedTourId;
            var tour = await _tourRepo.GetByIdAsync(parsedTourId);
            if (tour != null) tourTitle = tour.Title;
        }

        // 3. Resolve Route Corridor
        var airports = (await _airportRepo.GetAllAsync()).ToDictionary(a => a.Id);
        airports.TryGetValue(flight.OriginAirportId, out var orig);
        airports.TryGetValue(flight.DestinationAirportId, out var dest);
        string route = $"{orig?.IataCode ?? "SGN"} -> {dest?.IataCode ?? "DAD"}";

        // 4. Generate PNR Code (e.g. BK-2026-8849)
        string pnr = $"BK-2026-{Random.Shared.Next(1000, 9999)}";

        // Calculate Pricing
        decimal unitPrice = flight.Price > 0 ? flight.Price : 299m;
        decimal rawTotal = unitPrice * dto.AdultsCount + (unitPrice * 0.75m * dto.ChildrenCount);
        decimal discount = dto.Discount;
        decimal totalPrice = Math.Max(0, rawTotal - discount);

        // 5. Create Booking Entity
        var booking = new Booking
        {
            BookingReference = pnr,
            UserId = userId,
            FlightId = flightId,
            TourId = tourId,
            Route = route,
            CustomerName = dto.ContactName,
            CustomerEmail = dto.ContactEmail,
            CustomerPhone = dto.ContactPhone,
            CustomerZalo = dto.ContactZalo,
            AdultsCount = dto.AdultsCount,
            ChildrenCount = dto.ChildrenCount,
            TotalPrice = totalPrice,
            DiscountAmount = discount,
            PaymentMethod = dto.PaymentMethod,
            BookingStatus = "CONFIRMED",
            Notes = dto.Notes,
            CreatedAt = DateTime.UtcNow
        };

        var createdBooking = await _bookingRepo.AddAsync(booking);

        // 6. Manifest Passengers
        var passengerList = new List<Passenger>();
        if (dto.Passengers != null && dto.Passengers.Count > 0)
        {
            foreach (var p in dto.Passengers)
            {
                var passenger = new Passenger
                {
                    BookingId = createdBooking.Id,
                    FullName = p.FullName,
                    IdOrPassport = p.IdNumber,
                    Gender = p.Gender,
                    PassengerType = p.PassengerType,
                    SelectedSeat = p.SelectedSeat
                };
                passengerList.Add(await _passengerRepo.AddAsync(passenger));
            }
        }
        else
        {
            // Fallback: create primary passenger from contact name
            var primary = new Passenger
            {
                BookingId = createdBooking.Id,
                FullName = dto.ContactName,
                Gender = "MALE",
                PassengerType = "ADULT",
                SelectedSeat = dto.SelectedSeats.FirstOrDefault()
            };
            passengerList.Add(await _passengerRepo.AddAsync(primary));
        }

        // 7. Physical Seat Allocations (if selected)
        if (dto.SelectedSeats != null && dto.SelectedSeats.Count > 0)
        {
            var seats = await _seatRepo.GetAsync(s => s.AircraftId == flight.AircraftId);
            for (int i = 0; i < dto.SelectedSeats.Count && i < passengerList.Count; i++)
            {
                var seatNo = dto.SelectedSeats[i];
                var physicalSeat = seats.FirstOrDefault(s => s.SeatNumber.Equals(seatNo, StringComparison.OrdinalIgnoreCase));
                if (physicalSeat != null)
                {
                    await _seatAssignmentRepo.AddAsync(new SeatAssignment
                    {
                        BookingId = createdBooking.Id,
                        FlightId = flightId,
                        PassengerId = passengerList[i].Id,
                        SeatId = physicalSeat.Id,
                        AssignedSeatNumber = seatNo,
                        BoardingGroup = "Zone 2",
                        IsCheckedIn = true
                    });
                }
            }
        }

        // 8. Financial Payment Record
        await _paymentRepo.AddAsync(new Payment
        {
            BookingId = createdBooking.Id,
            TransactionReference = $"TXN-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}",
            Amount = totalPrice,
            PaymentMethod = dto.PaymentMethod,
            PaymentStatus = "SUCCESS",
            CreatedAt = DateTime.UtcNow
        });

        // 9. Decrement flight inventory
        flight.SeatsAvailable = Math.Max(0, flight.SeatsAvailable - totalSeatsRequested);
        await _flightRepo.UpdateAsync(flight);

        var resultDto = MapToDto(createdBooking, flight, tourTitle, passengerList);
        return ApiResponse<BookingDto>.Ok(resultDto, "Booking confirmed with official PNR.", 1);
    }

    public async Task<ApiResponse<List<BookingDto>>> GetAllBookingsAsync()
    {
        var bookings = await _bookingRepo.GetAllAsync();
        var flights = (await _flightRepo.GetAllAsync()).ToDictionary(f => f.Id);
        var tours = (await _tourRepo.GetAllAsync()).ToDictionary(t => t.Id);
        var passengers = (await _passengerRepo.GetAllAsync()).GroupBy(p => p.BookingId).ToDictionary(g => g.Key, g => g.ToList());

        var dtos = bookings.Select(b =>
        {
            flights.TryGetValue(b.FlightId, out var flight);
            string tourTitle = b.TourId.HasValue && tours.TryGetValue(b.TourId.Value, out var tour) ? tour.Title : "Flight Corridor Booking";
            passengers.TryGetValue(b.Id, out var pList);
            return MapToDto(b, flight, tourTitle, pList ?? new());
        }).ToList();

        return ApiResponse<List<BookingDto>>.Ok(dtos, total: dtos.Count);
    }

    public async Task<ApiResponse<List<BookingDto>>> GetUserBookingsAsync(int userId)
    {
        var bookings = await _bookingRepo.GetAsync(b => b.UserId == userId);
        var flights = (await _flightRepo.GetAllAsync()).ToDictionary(f => f.Id);
        var tours = (await _tourRepo.GetAllAsync()).ToDictionary(t => t.Id);
        var passengers = (await _passengerRepo.GetAllAsync()).GroupBy(p => p.BookingId).ToDictionary(g => g.Key, g => g.ToList());

        var dtos = bookings.Select(b =>
        {
            flights.TryGetValue(b.FlightId, out var flight);
            string tourTitle = b.TourId.HasValue && tours.TryGetValue(b.TourId.Value, out var tour) ? tour.Title : "Flight Corridor Booking";
            passengers.TryGetValue(b.Id, out var pList);
            return MapToDto(b, flight, tourTitle, pList ?? new());
        }).ToList();

        return ApiResponse<List<BookingDto>>.Ok(dtos, total: dtos.Count);
    }

    public async Task<ApiResponse<BookingDto>> GetBookingByReferenceAsync(string reference)
    {
        var cleanRef = reference.Trim();
        bool isNumeric = int.TryParse(cleanRef, out int bId);
        var bookings = await _bookingRepo.GetAsync(b => b.BookingReference.ToLower() == cleanRef.ToLower() || (isNumeric && b.Id == bId));
        var booking = bookings.FirstOrDefault();
        if (booking == null)
            return ApiResponse<BookingDto>.Fail($"PNR {reference} not found in reservation database.");

        var flight = await _flightRepo.GetByIdAsync(booking.FlightId);
        string tourTitle = "Flight Corridor Booking";
        if (booking.TourId.HasValue)
        {
            var tour = await _tourRepo.GetByIdAsync(booking.TourId.Value);
            if (tour != null) tourTitle = tour.Title;
        }

        var passengers = await _passengerRepo.GetAsync(p => p.BookingId == booking.Id);
        return ApiResponse<BookingDto>.Ok(MapToDto(booking, flight, tourTitle, passengers.ToList()));
    }

    public async Task<ApiResponse<bool>> CancelBookingAsync(int id)
    {
        var booking = await _bookingRepo.GetByIdAsync(id);
        if (booking == null) return ApiResponse<bool>.Fail($"Booking {id} not found.");

        booking.BookingStatus = "CANCELLED";
        await _bookingRepo.UpdateAsync(booking);

        // Restore flight capacity
        var flight = await _flightRepo.GetByIdAsync(booking.FlightId);
        if (flight != null)
        {
            flight.SeatsAvailable += (booking.AdultsCount + booking.ChildrenCount);
            await _flightRepo.UpdateAsync(flight);
        }

        return ApiResponse<bool>.Ok(true, "Booking cancelled and inventory returned.");
    }

    public async Task<ApiResponse<bool>> UpdateBookingStatusAsync(int id, string status)
    {
        var booking = await _bookingRepo.GetByIdAsync(id);
        if (booking == null) return ApiResponse<bool>.Fail($"Booking {id} not found.");

        booking.BookingStatus = status.ToUpperInvariant();
        await _bookingRepo.UpdateAsync(booking);
        return ApiResponse<bool>.Ok(true, "Booking status updated.");
    }

    private static BookingDto MapToDto(Booking b, Flight? flight, string tourTitle, List<Passenger> passengers)
    {
        return new BookingDto
        {
            Id = b.Id.ToString(),
            BookingCode = b.BookingReference,
            TourId = b.TourId?.ToString() ?? "",
            TourTitle = tourTitle,
            DepartureId = b.FlightId.ToString(),
            DepartureTime = flight?.DepartureTime.ToString("o") ?? b.CreatedAt.ToString("o"),
            ReturnTime = flight?.ArrivalTime.ToString("o"),
            Route = b.Route,
            CustomerName = b.CustomerName,
            CustomerEmail = b.CustomerEmail,
            CustomerPhone = b.CustomerPhone,
            CustomerZalo = b.CustomerZalo,
            AdultsCount = b.AdultsCount,
            ChildrenCount = b.ChildrenCount,
            TotalPrice = b.TotalPrice,
            DiscountAmount = b.DiscountAmount,
            CouponCode = b.Coupon?.Code,
            PaymentMethod = b.PaymentMethod,
            Status = b.BookingStatus,
            Notes = b.Notes,
            CreatedAt = b.CreatedAt.ToString("o"),
            Passengers = passengers.Select(p => new PassengerInfoDto
            {
                FullName = p.FullName,
                IdNumber = p.IdOrPassport,
                Gender = p.Gender,
                PassengerType = p.PassengerType,
                SelectedSeat = p.SelectedSeat
            }).ToList()
        };
    }
}

public class SeatService : ISeatService
{
    private readonly IRepository<Flight> _flightRepo;
    private readonly IRepository<Seat> _seatRepo;
    private readonly IRepository<SeatAssignment> _seatAssignmentRepo;

    public SeatService(
        IRepository<Flight> flightRepo,
        IRepository<Seat> seatRepo,
        IRepository<SeatAssignment> seatAssignmentRepo)
    {
        _flightRepo = flightRepo;
        _seatRepo = seatRepo;
        _seatAssignmentRepo = seatAssignmentRepo;
    }

    public async Task<ApiResponse<List<SeatDto>>> GetFlightSeatsAsync(int flightId)
    {
        var flight = await _flightRepo.GetByIdAsync(flightId);
        if (flight == null)
            return ApiResponse<List<SeatDto>>.Fail($"Flight {flightId} not found.");

        var allSeats = await _seatRepo.GetAsync(s => s.AircraftId == flight.AircraftId);
        var occupiedSeatIds = (await _seatAssignmentRepo.GetAsync(sa => sa.FlightId == flightId))
            .Select(sa => sa.SeatId)
            .ToHashSet();

        var seatDtos = allSeats.Select(s => new SeatDto
        {
            Id = s.Id.ToString(),
            SeatNumber = s.SeatNumber,
            TravelClass = s.TravelClass,
            IsExitRow = s.IsExitRow,
            IsOccupied = occupiedSeatIds.Contains(s.Id),
            PriceModifier = s.TravelClass == "BUSINESS" ? 150m : (s.IsExitRow ? 25m : 0m)
        }).OrderBy(s => s.SeatNumber).ToList();

        return ApiResponse<List<SeatDto>>.Ok(seatDtos);
    }

    public async Task<ApiResponse<bool>> AssignSeatAsync(int flightId, int passengerId, string seatNumber)
    {
        var flight = await _flightRepo.GetByIdAsync(flightId);
        if (flight == null) return ApiResponse<bool>.Fail("Flight not found.");

        var seat = (await _seatRepo.GetAsync(s => s.AircraftId == flight.AircraftId && s.SeatNumber == seatNumber)).FirstOrDefault();
        if (seat == null) return ApiResponse<bool>.Fail($"Seat {seatNumber} not configured on aircraft.");

        var alreadyOccupied = (await _seatAssignmentRepo.GetAsync(sa => sa.FlightId == flightId && sa.SeatId == seat.Id)).Any();
        if (alreadyOccupied) return ApiResponse<bool>.Fail($"Seat {seatNumber} is already occupied on flight.");

        await _seatAssignmentRepo.AddAsync(new SeatAssignment
        {
            FlightId = flightId,
            PassengerId = passengerId,
            SeatId = seat.Id,
            AssignedSeatNumber = seatNumber,
            IsCheckedIn = true
        });

        return ApiResponse<bool>.Ok(true, $"Seat {seatNumber} successfully assigned.");
    }
}
