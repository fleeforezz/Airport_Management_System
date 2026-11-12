using Domain.Common;

namespace Domain.Entities;

public class Airport : BaseEntity
{
    public string IataCode { get; set; } = string.Empty; // e.g. "SGN", "DAD"
    public string IcaoCode { get; set; } = string.Empty; // e.g. "VVTS", "VVRG"
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Timezone { get; set; } = "Asia/Ho_Chi_Minh";

    public virtual ICollection<Destination> ServicingDestinations { get; set; } = new List<Destination>();
}

public class Airline : BaseEntity
{
    public string IataCode { get; set; } = string.Empty; // e.g. "VN", "VJ"
    public string IcaoCode { get; set; } = string.Empty; // e.g. "HVN", "VJC"
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string LogoUrl { get; set; } = string.Empty;

    public virtual ICollection<Aircraft> Aircrafts { get; set; } = new List<Aircraft>();
    public virtual ICollection<Flight> Flights { get; set; } = new List<Flight>();
    public virtual ICollection<Tour> Tours { get; set; } = new List<Tour>();
}

public class Aircraft : BaseEntity
{
    public int AirlineId { get; set; }
    public virtual Airline Airline { get; set; } = null!;

    public string RegistrationNumber { get; set; } = string.Empty; // e.g. "VN-A899"
    public string Model { get; set; } = string.Empty; // e.g. "Airbus A350-900"
    public int Capacity { get; set; }
    public string Status { get; set; } = "ACTIVE"; // ACTIVE, MAINTENANCE, RETIRED

    public virtual ICollection<Seat> Seats { get; set; } = new List<Seat>();
    public virtual ICollection<Flight> Flights { get; set; } = new List<Flight>();
}

public class Seat : BaseEntity
{
    public int AircraftId { get; set; }
    public virtual Aircraft Aircraft { get; set; } = null!;

    public string SeatNumber { get; set; } = string.Empty; // e.g. "12A", "14C"
    public string TravelClass { get; set; } = "ECONOMY"; // FIRST, BUSINESS, PREMIUM_ECONOMY, ECONOMY
    public bool IsExitRow { get; set; } = false;

    public virtual ICollection<SeatAssignment> SeatAssignments { get; set; } = new List<SeatAssignment>();
}
