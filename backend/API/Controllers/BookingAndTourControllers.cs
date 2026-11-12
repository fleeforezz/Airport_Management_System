using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ToursController : ControllerBase
{
    private readonly ITourService _tourService;
    private readonly IFlightService _flightService;

    public ToursController(ITourService tourService, IFlightService flightService)
    {
        _tourService = tourService;
        _flightService = flightService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? destinationId)
    {
        var result = await _tourService.GetAllToursAsync(search, destinationId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _tourService.GetTourByIdAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet("{id}/departures")]
    public async Task<IActionResult> GetTourDepartures(int id)
    {
        var result = await _flightService.GetFlightsByTourAsync(id);
        return Ok(result);
    }

    [HttpPost("{id}/save")]
    public async Task<IActionResult> ToggleSave(int id)
    {
        var result = await _tourService.ToggleSaveTourAsync(id, 1);
        return Ok(result);
    }

    [HttpGet("saved")]
    public async Task<IActionResult> GetSavedTours()
    {
        var result = await _tourService.GetSavedToursAsync(1);
        return Ok(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class DestinationsController : ControllerBase
{
    private readonly IDestinationService _destinationService;

    public DestinationsController(IDestinationService destinationService)
    {
        _destinationService = destinationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _destinationService.GetAllDestinationsAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _destinationService.GetDestinationByIdAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingDto dto)
    {
        var result = await _bookingService.CreateBookingAsync(dto, 1);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _bookingService.GetAllBookingsAsync();
        return Ok(result);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyBookings()
    {
        var result = await _bookingService.GetUserBookingsAsync(1);
        return Ok(result);
    }

    [HttpGet("{referenceOrId}")]
    public async Task<IActionResult> GetByReference(string referenceOrId)
    {
        var result = await _bookingService.GetBookingByReferenceAsync(referenceOrId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var result = await _bookingService.CancelBookingAsync(id);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateFlightStatusDto dto)
    {
        var result = await _bookingService.UpdateBookingStatusAsync(id, dto.Status);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
