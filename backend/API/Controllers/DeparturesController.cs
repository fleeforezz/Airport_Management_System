using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeparturesController : ControllerBase
{
    private readonly IFlightService _flightService;
    private readonly ISeatService _seatService;

    public DeparturesController(IFlightService flightService, ISeatService seatService)
    {
        _flightService = flightService;
        _seatService = seatService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? origin, [FromQuery] string? destination, [FromQuery] DateTime? date)
    {
        var result = await _flightService.GetAllFlightsAsync(origin, destination, date);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _flightService.GetFlightByIdAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet("{id}/seats")]
    public async Task<IActionResult> GetSeats(int id)
    {
        var result = await _seatService.GetFlightSeatsAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFlightDto dto)
    {
        var result = await _flightService.CreateFlightAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = result.Data?.Id }, result);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateFlightStatusDto dto)
    {
        var result = await _flightService.UpdateFlightStatusAsync(id, dto.Status);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}

// Alias controller so both /api/flights and /api/departures work seamlessly
[ApiController]
[Route("api/flights")]
public class FlightsController : ControllerBase
{
    private readonly IFlightService _flightService;
    private readonly ISeatService _seatService;

    public FlightsController(IFlightService flightService, ISeatService seatService)
    {
        _flightService = flightService;
        _seatService = seatService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? origin, [FromQuery] string? destination, [FromQuery] DateTime? date)
    {
        var result = await _flightService.GetAllFlightsAsync(origin, destination, date);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _flightService.GetFlightByIdAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpGet("{id}/seats")]
    public async Task<IActionResult> GetSeats(int id)
    {
        var result = await _seatService.GetFlightSeatsAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }
}
