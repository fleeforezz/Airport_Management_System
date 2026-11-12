namespace Application.DTOs;

public class DestinationDto
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string AirportCode { get; set; } = string.Empty;
    public string AirportName { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? Climate { get; set; }
    public string? BestTimeToVisit { get; set; }
    public int? PopularToursCount { get; set; }
}

public class PassengerInfoDto
{
    public string FullName { get; set; } = string.Empty;
    public string? IdNumber { get; set; }
    public string Gender { get; set; } = "MALE";
    public string PassengerType { get; set; } = "ADULT";
    public string? SelectedSeat { get; set; }
}

public class BookingDto
{
    public string Id { get; set; } = string.Empty;
    public string BookingCode { get; set; } = string.Empty; // PNR
    public string TourId { get; set; } = string.Empty;
    public string TourTitle { get; set; } = string.Empty;
    public string DepartureId { get; set; } = string.Empty;
    public string DepartureTime { get; set; } = string.Empty;
    public string? ReturnTime { get; set; }
    public string Route { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerEmail { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerZalo { get; set; }
    public List<PassengerInfoDto> Passengers { get; set; } = new();
    public int AdultsCount { get; set; }
    public int ChildrenCount { get; set; }
    public decimal TotalPrice { get; set; }
    public decimal? DiscountAmount { get; set; }
    public string? CouponCode { get; set; }
    public string PaymentMethod { get; set; } = "CREDIT_CARD";
    public string Status { get; set; } = "PENDING";
    public string? Notes { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}

public class CreateBookingDto
{
    public string TourId { get; set; } = string.Empty;
    public string? DepartureId { get; set; }
    public int AdultsCount { get; set; } = 1;
    public int ChildrenCount { get; set; } = 0;
    public List<string> SelectedSeats { get; set; } = new();
    public List<PassengerInfoDto> Passengers { get; set; } = new();
    public string ContactName { get; set; } = string.Empty;
    public string ContactEmail { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public string? ContactZalo { get; set; }
    public string? Notes { get; set; }
    public string? CouponCode { get; set; }
    public decimal Discount { get; set; } = 0;
    public string PaymentMethod { get; set; } = "CREDIT_CARD";
}

public class SeatDto
{
    public string Id { get; set; } = string.Empty;
    public string SeatNumber { get; set; } = string.Empty;
    public string TravelClass { get; set; } = "ECONOMY";
    public bool IsExitRow { get; set; }
    public bool IsOccupied { get; set; }
    public decimal PriceModifier { get; set; } = 0;
}

public class CouponDto
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public decimal? DiscountPercent { get; set; }
    public decimal? DiscountAmount { get; set; }
    public decimal MinSpend { get; set; }
    public decimal? MaxDiscount { get; set; }
    public string ValidUntil { get; set; } = string.Empty;
    public int UsageCount { get; set; }
    public bool IsActive { get; set; }
}

public class VerifyCouponRequestDto
{
    public string Code { get; set; } = string.Empty;
    public decimal TotalAmount { get; set; }
}

public class VerifyCouponResponseDto
{
    public bool Valid { get; set; }
    public decimal DiscountAmount { get; set; }
    public string Message { get; set; } = string.Empty;
}

public class ArticleDto
{
    public string Id { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string CoverImage { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string? AuthorRole { get; set; }
    public string PublishedAt { get; set; } = string.Empty;
    public string Category { get; set; } = "AIRPORT_GUIDE";
    public int ReadTimeMinutes { get; set; }
    public List<string> Tags { get; set; } = new();
}

public class DashboardStatsDto
{
    public int TotalBookingsMonth { get; set; }
    public decimal DispatchedRevenue { get; set; }
    public int ScheduledFlightSlots { get; set; }
    public int ActiveFleetCount { get; set; }
    public List<BookingDto> RecentBookings { get; set; } = new();
}
