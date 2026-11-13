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

    [HttpPost]
    public async Task<IActionResult> CreateTour([FromBody] CreateTourDto dto)
    {
        var result = await _tourService.CreateTourAsync(dto, 2); // 2 = Operator
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTour(int id, [FromBody] CreateTourDto dto)
    {
        var result = await _tourService.UpdateTourAsync(id, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTour(int id)
    {
        var result = await _tourService.DeleteTourAsync(id);
        return result.Success ? Ok(result) : BadRequest(result);
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

    [HttpPost("{referenceOrId}/cancel")]
    public async Task<IActionResult> Cancel(string referenceOrId, [FromBody] CancelBookingRequestDto? dto)
    {
        var result = await _bookingService.CancelBookingAsync(referenceOrId, dto?.Reason);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateFlightStatusDto dto)
    {
        var result = await _bookingService.UpdateBookingStatusAsync(id, dto.Status);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class AirlinesController : ControllerBase
{
    private readonly IAirlineService _airlineService;

    public AirlinesController(IAirlineService airlineService)
    {
        _airlineService = airlineService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _airlineService.GetAllAirlinesAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _airlineService.GetAirlineByIdAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAirlineDto dto)
    {
        var result = await _airlineService.CreateAirlineAsync(dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateAirlineDto dto)
    {
        var result = await _airlineService.UpdateAirlineAsync(id, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _airlineService.DeleteAirlineAsync(id);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _userService.GetAllUsersAsync();
        return Ok(result);
    }

    [HttpPatch("{id}/role")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateFlightStatusDto dto)
    {
        var result = await _userService.UpdateUserRoleAsync(id, dto.Status);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _userService.DeleteUserAsync(id);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}/profile")]
    [HttpPatch("{id}/profile")]
    public async Task<IActionResult> UpdateProfile(string id, [FromBody] UpdateProfileDto dto)
    {
        var result = await _userService.UpdateProfileAsync(id, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{id}/avatar")]
    [HttpPost("{id}/avatar")]
    public async Task<IActionResult> UpdateAvatar(string id, [FromBody] UpdateAvatarDto dto)
    {
        var result = await _userService.UpdateAvatarAsync(id, dto.AvatarUrl);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
