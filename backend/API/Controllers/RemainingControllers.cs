using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly ICouponService _couponService;

    public CouponsController(ICouponService couponService)
    {
        _couponService = couponService;
    }

    [HttpPost("verify")]
    public async Task<IActionResult> Verify([FromBody] VerifyCouponRequestDto dto)
    {
        var result = await _couponService.VerifyCouponAsync(dto.Code, dto.TotalAmount);
        return Ok(result);
    }

    [HttpGet("validate/{code}")]
    public async Task<IActionResult> Validate(string code, [FromQuery] decimal amount = 100)
    {
        var result = await _couponService.VerifyCouponAsync(code, amount);
        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _couponService.GetAllCouponsAsync();
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly IArticleService _articleService;

    public ArticlesController(IArticleService articleService)
    {
        _articleService = articleService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
    {
        var result = await _articleService.GetAllArticlesAsync(category);
        return Ok(result);
    }

    [HttpGet("{slugOrId}")]
    public async Task<IActionResult> GetBySlugOrId(string slugOrId)
    {
        var result = await _articleService.GetArticleBySlugOrIdAsync(slugOrId);
        return result.Success ? Ok(result) : NotFound(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    private readonly IBookingService _bookingService;
    private readonly IFlightService _flightService;

    public AdminController(
        IAnalyticsService analyticsService,
        IBookingService bookingService,
        IFlightService flightService)
    {
        _analyticsService = analyticsService;
        _bookingService = bookingService;
        _flightService = flightService;
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var result = await _analyticsService.GetDashboardStatsAsync();
        return Ok(result);
    }

    [HttpGet("bookings")]
    public async Task<IActionResult> GetBookings()
    {
        var result = await _bookingService.GetAllBookingsAsync();
        return Ok(result);
    }

    [HttpPatch("bookings/{id}/status")]
    public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] UpdateFlightStatusDto dto)
    {
        var result = await _bookingService.UpdateBookingStatusAsync(id, dto.Status);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet("departures")]
    public async Task<IActionResult> GetDepartures()
    {
        var result = await _flightService.GetAllFlightsAsync();
        return Ok(result);
    }
}
