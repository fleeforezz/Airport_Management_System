using Domain.Common;

namespace Domain.Entities;

public class Flight : BaseEntity
{
    public int? TourId { get; set; }
    public virtual Tour? Tour { get; set; }

    public int OriginAirportId { get; set; }
    public virtual Airport OriginAirport { get; set; } = null!;

    public int DestinationAirportId { get; set; }
    public virtual Airport DestinationAirport { get; set; } = null!;

    public int AirlineId { get; set; }
    public virtual Airline Airline { get; set; } = null!;

    public int AircraftId { get; set; }
    public virtual Aircraft Aircraft { get; set; } = null!;

    public string FlightNumber { get; set; } = string.Empty; // e.g. "VN-124"
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public string? Terminal { get; set; }
    public string? Gate { get; set; }
    public int TotalSeats { get; set; }
    public int SeatsAvailable { get; set; }
    public decimal Price { get; set; }
    public string Status { get; set; } = "ON_TIME"; // SCHEDULED, ON_TIME, BOARDING, DEPARTED, DELAYED, CANCELLED

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public virtual ICollection<SeatAssignment> SeatAssignments { get; set; } = new List<SeatAssignment>();
}

public class UserAccount : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Role { get; set; } = "TRAVELER"; // ADMIN, TOUR_OPERATOR, TRAVELER
    public string? ZaloId { get; set; }
    public string? AvatarUrl { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public virtual ICollection<Article> Articles { get; set; } = new List<Article>();
}

public class Booking : BaseEntity
{
    public string BookingReference { get; set; } = string.Empty; // PNR: e.g. "BK-2026-8849"

    public int? UserId { get; set; }
    public virtual UserAccount? User { get; set; }

    public int FlightId { get; set; }
    public virtual Flight Flight { get; set; } = null!;

    public int? TourId { get; set; }
    public virtual Tour? Tour { get; set; }

    public int? CouponId { get; set; }
    public virtual Coupon? Coupon { get; set; }

    public string Route { get; set; } = string.Empty; // e.g. "SGN -> DAD"
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerZalo { get; set; }
    public int AdultsCount { get; set; } = 1;
    public int ChildrenCount { get; set; } = 0;
    public decimal TotalPrice { get; set; }
    public decimal DiscountAmount { get; set; } = 0.00m;
    
    // Baggage surcharge & add-on options
    public string BaggagePackage { get; set; } = "NONE"; // NONE, EXTRA_10KG, EXTRA_20KG, EXTRA_30KG, SPORTS_EQUIPMENT
    public decimal BaggageFee { get; set; } = 0.00m;

    // Cancellation policy execution
    public decimal? RefundAmount { get; set; }
    public string? CancellationReason { get; set; }
    public DateTime? CancellationDate { get; set; }

    public string PaymentMethod { get; set; } = "CREDIT_CARD"; // CREDIT_CARD, BANK_TRANSFER, ZALO_PAY, AIRPORT_COUNTER
    public string BookingStatus { get; set; } = "CONFIRMED"; // PENDING, CONFIRMED, PAID, COMPLETED, CANCELLED
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<Passenger> Passengers { get; set; } = new List<Passenger>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public virtual ICollection<SeatAssignment> SeatAssignments { get; set; } = new List<SeatAssignment>();
}

public class Passenger : BaseEntity
{
    public int BookingId { get; set; }
    public virtual Booking Booking { get; set; } = null!;

    public string FullName { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string? IdOrPassport { get; set; }
    public string Gender { get; set; } = "MALE"; // MALE, FEMALE, OTHER
    public string PassengerType { get; set; } = "ADULT"; // ADULT, CHILD, INFANT
    public string? SelectedSeat { get; set; }

    public virtual SeatAssignment? SeatAssignment { get; set; }
}

public class SeatAssignment : BaseEntity
{
    public int PassengerId { get; set; }
    public virtual Passenger Passenger { get; set; } = null!;

    public int FlightId { get; set; }
    public virtual Flight Flight { get; set; } = null!;

    public int SeatId { get; set; }
    public virtual Seat Seat { get; set; } = null!;

    public int BookingId { get; set; }
    public virtual Booking Booking { get; set; } = null!;

    public string AssignedSeatNumber { get; set; } = string.Empty; // e.g. "14A"
    public string? BoardingGroup { get; set; } // e.g. "Zone 2"
    public bool IsCheckedIn { get; set; } = false;
}

public class Payment : BaseEntity
{
    public int BookingId { get; set; }
    public virtual Booking Booking { get; set; } = null!;

    public string TransactionReference { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = "CREDIT_CARD";
    public string PaymentStatus { get; set; } = "SUCCESS"; // PENDING, SUCCESS, FAILED, REFUNDED
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class Coupon : BaseEntity
{
    public string Code { get; set; } = string.Empty; // e.g. "FLYSUMMER"
    public string Description { get; set; } = string.Empty;
    public decimal? DiscountPercent { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal MinSpend { get; set; } = 0.00m;
    public decimal? MaxDiscount { get; set; }
    public DateTime ValidUntil { get; set; }
    public int UsageCount { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}

public class Article : BaseEntity
{
    public int? AuthorId { get; set; }
    public virtual UserAccount? Author { get; set; }

    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string CoverImage { get; set; } = string.Empty;
    public string AuthorName { get; set; } = "Flight Operations Editorial";
    public string? AuthorRole { get; set; } = "Chief Dispatcher";
    public string Category { get; set; } = "AIRPORT_GUIDE"; // AIRPORT_GUIDE, DESTINATION, FLIGHT_TIPS, NEWS
    public int ReadTimeMinutes { get; set; } = 5;
    public string TagsJson { get; set; } = "[]";
    public DateTime PublishedAt { get; set; } = DateTime.UtcNow;
}
