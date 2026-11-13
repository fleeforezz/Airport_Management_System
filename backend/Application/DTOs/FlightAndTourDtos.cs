namespace Application.DTOs;

public class FlightDto
{
    public string Id { get; set; } = string.Empty;
    public string TourId { get; set; } = string.Empty;
    public string FlightNumber { get; set; } = string.Empty; // e.g. "VN-124"
    public string DepartureAirport { get; set; } = string.Empty; // "SGN"
    public string ArrivalAirport { get; set; } = string.Empty; // "DAD"
    public string DepartureTime { get; set; } = string.Empty;
    public string ArrivalTime { get; set; } = string.Empty;
    public int SeatsAvailable { get; set; }
    public int TotalSeats { get; set; }
    public decimal Price { get; set; }
    public string? AircraftModel { get; set; }
    public string? Terminal { get; set; }
    public string? Gate { get; set; }
    public string Status { get; set; } = "ON_TIME";
}

public class CreateFlightDto
{
    public int? TourId { get; set; }
    public int OriginAirportId { get; set; }
    public int DestinationAirportId { get; set; }
    public int AirlineId { get; set; }
    public int AircraftId { get; set; }
    public string FlightNumber { get; set; } = string.Empty;
    public DateTime DepartureTime { get; set; }
    public DateTime ArrivalTime { get; set; }
    public string? Terminal { get; set; }
    public string? Gate { get; set; }
    public int TotalSeats { get; set; }
    public decimal Price { get; set; }
    public string Status { get; set; } = "SCHEDULED";
}

public class UpdateFlightStatusDto
{
    public string Status { get; set; } = "ON_TIME";
}

public class ItineraryDayDto
{
    public int DayNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<string> Activities { get; set; } = new();
    public string? Meals { get; set; }
    public string? Stay { get; set; }
}

public class TourDto
{
    public string Id { get; set; } = string.Empty;
    public string? OperatorId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string DestinationId { get; set; } = string.Empty;
    public string DestinationName { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int DurationDays { get; set; }
    public int DurationNights { get; set; }
    public string DepartureCity { get; set; } = string.Empty;
    public string TransportType { get; set; } = "FLIGHT_EXCLUSIVE";
    public string? AirlineCode { get; set; }
    public string? AirlineName { get; set; }
    public string FeaturedImage { get; set; } = string.Empty;
    public List<string> GalleryImages { get; set; } = new();
    public List<string> Highlights { get; set; } = new();
    public List<string> Inclusions { get; set; } = new();
    public List<string> Exclusions { get; set; } = new();
    public string BaggagePolicy { get; set; } = string.Empty;
    public string CancellationPolicy { get; set; } = string.Empty;
    public List<ItineraryDayDto> Itinerary { get; set; } = new();
    public double Rating { get; set; }
    public int ReviewsCount { get; set; }
    public bool? IsSaved { get; set; }
    public string Status { get; set; } = "ACTIVE";
}

public class CreateTourDto
{
    public string Code { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public int DestinationId { get; set; }
    public int? AirlineId { get; set; }
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int DurationDays { get; set; }
    public int DurationNights { get; set; }
    public string DepartureCity { get; set; } = "Ho Chi Minh City (SGN)";
    public string FeaturedImage { get; set; } = string.Empty;
    public List<string>? GalleryImages { get; set; }
    public List<string>? Highlights { get; set; }
    public List<string>? Inclusions { get; set; }
    public List<string>? Exclusions { get; set; }
    public string? BaggagePolicy { get; set; }
    public string? CancellationPolicy { get; set; }
    public List<ItineraryDayDto>? Itinerary { get; set; }
}
