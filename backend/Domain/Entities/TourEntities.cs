using Domain.Common;

namespace Domain.Entities;

public class Destination : BaseEntity
{
    public int AirportId { get; set; }
    public virtual Airport Airport { get; set; } = null!;

    public string Code { get; set; } = string.Empty; // e.g. "DAD", "JFK"
    public string Name { get; set; } = string.Empty; // e.g. "Da Nang"
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Climate { get; set; }
    public string? BestTimeToVisit { get; set; }
    public int PopularToursCount { get; set; } = 0;

    public virtual ICollection<Tour> Tours { get; set; } = new List<Tour>();
}

public class Tour : BaseEntity
{
    public int DestinationId { get; set; }
    public virtual Destination Destination { get; set; } = null!;

    public int? AirlineId { get; set; }
    public virtual Airline? Airline { get; set; }

    public int? OperatorId { get; set; } // ID of Tour Operator who manages this tour

    public string Code { get; set; } = string.Empty; // e.g. "VN-DAD-01"
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int DurationDays { get; set; }
    public int DurationNights { get; set; }
    public string DepartureCity { get; set; } = "Ho Chi Minh City (SGN)";
    public string TransportType { get; set; } = "FLIGHT_EXCLUSIVE"; // 100% Aviation Exclusive
    public string FeaturedImage { get; set; } = string.Empty;
    public string GalleryImagesJson { get; set; } = "[]";
    public string HighlightsJson { get; set; } = "[]";
    public string InclusionsJson { get; set; } = "[\"Round-trip flight tickets with assigned seat\",\"4-star or 5-star resort hotel accommodations\",\"Daily breakfast and scheduled itinerary meals\",\"Licensed bilingual tour guide\",\"Attraction entrance passes\"]";
    public string ExclusionsJson { get; set; } = "[\"Personal expenses & optional gratuities\",\"Single room supplement fee\",\"Excess baggage beyond standard 20kg allowance\"]";
    public string BaggagePolicy { get; set; } = "Standard 7kg carry-on and 20kg checked baggage included free of charge with every flight ticket. Extra checked baggage can be purchased during checkout.";
    public string CancellationPolicy { get; set; } = "Cancel 15+ days prior to departure: 100% refund. Cancel 7-14 days prior: 70% refund (30% penalty). Cancel 3-6 days prior: 40% refund (60% penalty). Cancel within 48 hours: Non-refundable (100% penalty).";
    public double Rating { get; set; } = 5.0;
    public int ReviewsCount { get; set; } = 0;
    public string Status { get; set; } = "ACTIVE"; // ACTIVE, DRAFT, SOLD_OUT

    public virtual ICollection<ItineraryDay> ItineraryDays { get; set; } = new List<ItineraryDay>();
    public virtual ICollection<Flight> Flights { get; set; } = new List<Flight>();
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}

public class ItineraryDay : BaseEntity
{
    public int TourId { get; set; }
    public virtual Tour Tour { get; set; } = null!;

    public int DayNumber { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ActivitiesJson { get; set; } = "[]";
    public string? Meals { get; set; }
    public string? Stay { get; set; }
}
