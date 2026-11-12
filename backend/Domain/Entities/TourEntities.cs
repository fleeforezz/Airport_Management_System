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

    public string Code { get; set; } = string.Empty; // e.g. "VN-DAD-01"
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public int DurationDays { get; set; }
    public int DurationNights { get; set; }
    public string DepartureCity { get; set; } = "Ho Chi Minh City";
    public string TransportType { get; set; } = "FLIGHT"; // FLIGHT, COMBO_AIR_HOTEL, CHARTER
    public string FeaturedImage { get; set; } = string.Empty;
    public string GalleryImagesJson { get; set; } = "[]";
    public string HighlightsJson { get; set; } = "[]";
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
