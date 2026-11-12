using Application.Common;
using Application.DTOs;

namespace Application.Interfaces;

public interface IFlightService
{
    Task<ApiResponse<List<FlightDto>>> GetAllFlightsAsync(string? origin = null, string? destination = null, DateTime? date = null);
    Task<ApiResponse<List<FlightDto>>> GetFlightsByTourAsync(int tourId);
    Task<ApiResponse<FlightDto>> GetFlightByIdAsync(int id);
    Task<ApiResponse<FlightDto>> CreateFlightAsync(CreateFlightDto dto);
    Task<ApiResponse<bool>> UpdateFlightStatusAsync(int id, string status);
}

public interface ITourService
{
    Task<ApiResponse<List<TourDto>>> GetAllToursAsync(string? search = null, string? destinationId = null);
    Task<ApiResponse<TourDto>> GetTourByIdAsync(int id);
    Task<ApiResponse<bool>> ToggleSaveTourAsync(int tourId, int userId);
    Task<ApiResponse<List<TourDto>>> GetSavedToursAsync(int userId);
}

public interface IDestinationService
{
    Task<ApiResponse<List<DestinationDto>>> GetAllDestinationsAsync();
    Task<ApiResponse<DestinationDto>> GetDestinationByIdAsync(int id);
}

public interface IBookingService
{
    Task<ApiResponse<BookingDto>> CreateBookingAsync(CreateBookingDto dto, int? userId = null);
    Task<ApiResponse<List<BookingDto>>> GetAllBookingsAsync();
    Task<ApiResponse<List<BookingDto>>> GetUserBookingsAsync(int userId);
    Task<ApiResponse<BookingDto>> GetBookingByReferenceAsync(string reference);
    Task<ApiResponse<bool>> CancelBookingAsync(int id);
    Task<ApiResponse<bool>> UpdateBookingStatusAsync(int id, string status);
}

public interface ISeatService
{
    Task<ApiResponse<List<SeatDto>>> GetFlightSeatsAsync(int flightId);
    Task<ApiResponse<bool>> AssignSeatAsync(int flightId, int passengerId, string seatNumber);
}

public interface ICouponService
{
    Task<ApiResponse<VerifyCouponResponseDto>> VerifyCouponAsync(string code, decimal totalAmount);
    Task<ApiResponse<List<CouponDto>>> GetAllCouponsAsync();
}

public interface IArticleService
{
    Task<ApiResponse<List<ArticleDto>>> GetAllArticlesAsync(string? category = null);
    Task<ApiResponse<ArticleDto>> GetArticleBySlugOrIdAsync(string slugOrId);
}

public interface IAuthService
{
    Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto dto);
    Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto dto);
    Task<ApiResponse<UserDto>> GetCurrentUserAsync(int userId);
}

public interface IAnalyticsService
{
    Task<ApiResponse<DashboardStatsDto>> GetDashboardStatsAsync();
}
