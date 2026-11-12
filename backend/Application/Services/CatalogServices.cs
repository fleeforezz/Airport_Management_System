using System.Text.Json;
using Application.Common;
using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;

namespace Application.Services;

public class FlightService : IFlightService
{
    private readonly IRepository<Flight> _flightRepo;
    private readonly IRepository<Airport> _airportRepo;
    private readonly IRepository<Airline> _airlineRepo;
    private readonly IRepository<Aircraft> _aircraftRepo;

    public FlightService(
        IRepository<Flight> flightRepo,
        IRepository<Airport> airportRepo,
        IRepository<Airline> airlineRepo,
        IRepository<Aircraft> aircraftRepo)
    {
        _flightRepo = flightRepo;
        _airportRepo = airportRepo;
        _airlineRepo = airlineRepo;
        _aircraftRepo = aircraftRepo;
    }

    public async Task<ApiResponse<List<FlightDto>>> GetAllFlightsAsync(string? origin = null, string? destination = null, DateTime? date = null)
    {
        var flights = await _flightRepo.GetAllAsync();
        var airports = (await _airportRepo.GetAllAsync()).ToDictionary(a => a.Id);
        var aircrafts = (await _aircraftRepo.GetAllAsync()).ToDictionary(a => a.Id);

        var query = flights.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(origin))
        {
            query = query.Where(f => airports.TryGetValue(f.OriginAirportId, out var o) &&
                                     (o.IataCode.Equals(origin, StringComparison.OrdinalIgnoreCase) ||
                                      o.City.Contains(origin, StringComparison.OrdinalIgnoreCase)));
        }

        if (!string.IsNullOrWhiteSpace(destination))
        {
            query = query.Where(f => airports.TryGetValue(f.DestinationAirportId, out var d) &&
                                     (d.IataCode.Equals(destination, StringComparison.OrdinalIgnoreCase) ||
                                      d.City.Contains(destination, StringComparison.OrdinalIgnoreCase)));
        }

        if (date.HasValue)
        {
            query = query.Where(f => f.DepartureTime.Date == date.Value.Date);
        }

        var dtos = query.Select(f => MapToDto(f, airports, aircrafts)).ToList();
        return ApiResponse<List<FlightDto>>.Ok(dtos, total: dtos.Count);
    }

    public async Task<ApiResponse<List<FlightDto>>> GetFlightsByTourAsync(int tourId)
    {
        var flights = await _flightRepo.GetAsync(f => f.TourId == tourId);
        var airports = (await _airportRepo.GetAllAsync()).ToDictionary(a => a.Id);
        var aircrafts = (await _aircraftRepo.GetAllAsync()).ToDictionary(a => a.Id);

        var dtos = flights.Select(f => MapToDto(f, airports, aircrafts)).ToList();
        return ApiResponse<List<FlightDto>>.Ok(dtos, total: dtos.Count);
    }

    public async Task<ApiResponse<FlightDto>> GetFlightByIdAsync(int id)
    {
        var flight = await _flightRepo.GetByIdAsync(id);
        if (flight == null)
            return ApiResponse<FlightDto>.Fail($"Flight with ID {id} not found.");

        var airports = (await _airportRepo.GetAllAsync()).ToDictionary(a => a.Id);
        var aircrafts = (await _aircraftRepo.GetAllAsync()).ToDictionary(a => a.Id);

        return ApiResponse<FlightDto>.Ok(MapToDto(flight, airports, aircrafts));
    }

    public async Task<ApiResponse<FlightDto>> CreateFlightAsync(CreateFlightDto dto)
    {
        var flight = new Flight
        {
            TourId = dto.TourId,
            OriginAirportId = dto.OriginAirportId,
            DestinationAirportId = dto.DestinationAirportId,
            AirlineId = dto.AirlineId,
            AircraftId = dto.AircraftId,
            FlightNumber = dto.FlightNumber,
            DepartureTime = dto.DepartureTime,
            ArrivalTime = dto.ArrivalTime,
            Terminal = dto.Terminal,
            Gate = dto.Gate,
            TotalSeats = dto.TotalSeats,
            SeatsAvailable = dto.TotalSeats,
            Price = dto.Price,
            Status = dto.Status
        };

        var created = await _flightRepo.AddAsync(flight);
        var airports = (await _airportRepo.GetAllAsync()).ToDictionary(a => a.Id);
        var aircrafts = (await _aircraftRepo.GetAllAsync()).ToDictionary(a => a.Id);

        return ApiResponse<FlightDto>.Ok(MapToDto(created, airports, aircrafts), "Flight created successfully.");
    }

    public async Task<ApiResponse<bool>> UpdateFlightStatusAsync(int id, string status)
    {
        var flight = await _flightRepo.GetByIdAsync(id);
        if (flight == null)
            return ApiResponse<bool>.Fail($"Flight with ID {id} not found.");

        flight.Status = status.ToUpperInvariant();
        await _flightRepo.UpdateAsync(flight);
        return ApiResponse<bool>.Ok(true, "Flight status updated.");
    }

    private static FlightDto MapToDto(Flight f, Dictionary<int, Airport> airports, Dictionary<int, Aircraft> aircrafts)
    {
        airports.TryGetValue(f.OriginAirportId, out var origin);
        airports.TryGetValue(f.DestinationAirportId, out var dest);
        aircrafts.TryGetValue(f.AircraftId, out var aircraft);

        return new FlightDto
        {
            Id = f.Id.ToString(),
            TourId = f.TourId?.ToString() ?? "",
            FlightNumber = f.FlightNumber,
            DepartureAirport = origin?.IataCode ?? "SGN",
            ArrivalAirport = dest?.IataCode ?? "DAD",
            DepartureTime = f.DepartureTime.ToString("o"),
            ArrivalTime = f.ArrivalTime.ToString("o"),
            SeatsAvailable = f.SeatsAvailable,
            TotalSeats = f.TotalSeats,
            Price = f.Price,
            AircraftModel = aircraft?.Model ?? "Airbus A350-900",
            Terminal = f.Terminal ?? "T2",
            Gate = f.Gate ?? "G12",
            Status = f.Status
        };
    }
}

public class TourService : ITourService
{
    private readonly IRepository<Tour> _tourRepo;
    private readonly IRepository<Destination> _destRepo;
    private readonly IRepository<Airline> _airlineRepo;
    private readonly IRepository<ItineraryDay> _itineraryRepo;

    public TourService(
        IRepository<Tour> tourRepo,
        IRepository<Destination> destRepo,
        IRepository<Airline> airlineRepo,
        IRepository<ItineraryDay> itineraryRepo)
    {
        _tourRepo = tourRepo;
        _destRepo = destRepo;
        _airlineRepo = airlineRepo;
        _itineraryRepo = itineraryRepo;
    }

    public async Task<ApiResponse<List<TourDto>>> GetAllToursAsync(string? search = null, string? destinationId = null)
    {
        var tours = await _tourRepo.GetAllAsync();
        var destinations = (await _destRepo.GetAllAsync()).ToDictionary(d => d.Id);
        var airlines = (await _airlineRepo.GetAllAsync()).ToDictionary(a => a.Id);
        var itineraries = (await _itineraryRepo.GetAllAsync()).GroupBy(i => i.TourId).ToDictionary(g => g.Key, g => g.OrderBy(i => i.DayNumber).ToList());

        var query = tours.AsEnumerable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            query = query.Where(t => t.Title.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                                     t.Code.Contains(search, StringComparison.OrdinalIgnoreCase) ||
                                     (destinations.TryGetValue(t.DestinationId, out var d) && d.Name.Contains(search, StringComparison.OrdinalIgnoreCase)));
        }

        if (!string.IsNullOrWhiteSpace(destinationId) && int.TryParse(destinationId, out int dId))
        {
            query = query.Where(t => t.DestinationId == dId);
        }

        var dtos = query.Select(t => MapToDto(t, destinations, airlines, itineraries)).ToList();
        return ApiResponse<List<TourDto>>.Ok(dtos, total: dtos.Count);
    }

    public async Task<ApiResponse<TourDto>> GetTourByIdAsync(int id)
    {
        var tour = await _tourRepo.GetByIdAsync(id);
        if (tour == null)
            return ApiResponse<TourDto>.Fail($"Tour with ID {id} not found.");

        var destinations = (await _destRepo.GetAllAsync()).ToDictionary(d => d.Id);
        var airlines = (await _airlineRepo.GetAllAsync()).ToDictionary(a => a.Id);
        var itineraries = (await _itineraryRepo.GetAsync(i => i.TourId == id)).OrderBy(i => i.DayNumber).ToList();

        var dict = new Dictionary<int, List<ItineraryDay>> { { id, itineraries } };
        return ApiResponse<TourDto>.Ok(MapToDto(tour, destinations, airlines, dict));
    }

    public Task<ApiResponse<bool>> ToggleSaveTourAsync(int tourId, int userId)
    {
        return Task.FromResult(ApiResponse<bool>.Ok(true, "Tour saved status toggled."));
    }

    public async Task<ApiResponse<List<TourDto>>> GetSavedToursAsync(int userId)
    {
        // Return active featured tours as saved for demo
        var all = await GetAllToursAsync();
        var saved = all.Data?.Take(2).Select(t => { t.IsSaved = true; return t; }).ToList() ?? new List<TourDto>();
        return ApiResponse<List<TourDto>>.Ok(saved);
    }

    private static TourDto MapToDto(Tour t, Dictionary<int, Destination> dests, Dictionary<int, Airline> airlines, Dictionary<int, List<ItineraryDay>> itineraries)
    {
        dests.TryGetValue(t.DestinationId, out var dest);
        Airline? airline = null;
        if (t.AirlineId.HasValue) airlines.TryGetValue(t.AirlineId.Value, out airline);

        itineraries.TryGetValue(t.Id, out var days);

        List<string> gallery = new();
        List<string> highlights = new();
        try { gallery = JsonSerializer.Deserialize<List<string>>(t.GalleryImagesJson) ?? new(); } catch { }
        try { highlights = JsonSerializer.Deserialize<List<string>>(t.HighlightsJson) ?? new(); } catch { }

        var dayDtos = (days ?? new List<ItineraryDay>()).Select(d =>
        {
            List<string> acts = new();
            try { acts = JsonSerializer.Deserialize<List<string>>(d.ActivitiesJson) ?? new(); } catch { }
            return new ItineraryDayDto
            {
                DayNumber = d.DayNumber,
                Title = d.Title,
                Description = d.Description,
                Activities = acts,
                Meals = d.Meals,
                Stay = d.Stay
            };
        }).ToList();

        return new TourDto
        {
            Id = t.Id.ToString(),
            Code = t.Code,
            Title = t.Title,
            Subtitle = t.Subtitle,
            DestinationId = t.DestinationId.ToString(),
            DestinationName = dest?.Name ?? "Domestic",
            Price = t.Price,
            OriginalPrice = t.OriginalPrice,
            DurationDays = t.DurationDays,
            DurationNights = t.DurationNights,
            DepartureCity = t.DepartureCity,
            TransportType = t.TransportType,
            AirlineCode = airline?.IataCode,
            AirlineName = airline?.Name,
            FeaturedImage = t.FeaturedImage,
            GalleryImages = gallery,
            Highlights = highlights,
            Itinerary = dayDtos,
            Rating = t.Rating,
            ReviewsCount = t.ReviewsCount,
            Status = t.Status
        };
    }
}

public class DestinationService : IDestinationService
{
    private readonly IRepository<Destination> _destRepo;
    private readonly IRepository<Airport> _airportRepo;

    public DestinationService(IRepository<Destination> destRepo, IRepository<Airport> airportRepo)
    {
        _destRepo = destRepo;
        _airportRepo = airportRepo;
    }

    public async Task<ApiResponse<List<DestinationDto>>> GetAllDestinationsAsync()
    {
        var destinations = await _destRepo.GetAllAsync();
        var airports = (await _airportRepo.GetAllAsync()).ToDictionary(a => a.Id);

        var dtos = destinations.Select(d =>
        {
            airports.TryGetValue(d.AirportId, out var airport);
            return new DestinationDto
            {
                Id = d.Id.ToString(),
                Code = d.Code,
                Name = d.Name,
                City = d.City,
                Country = d.Country,
                AirportCode = airport?.IataCode ?? d.Code,
                AirportName = airport?.Name ?? $"{d.Name} International Airport",
                ImageUrl = d.ImageUrl,
                Description = d.Description,
                Climate = d.Climate,
                BestTimeToVisit = d.BestTimeToVisit,
                PopularToursCount = d.PopularToursCount
            };
        }).ToList();

        return ApiResponse<List<DestinationDto>>.Ok(dtos, total: dtos.Count);
    }

    public async Task<ApiResponse<DestinationDto>> GetDestinationByIdAsync(int id)
    {
        var d = await _destRepo.GetByIdAsync(id);
        if (d == null) return ApiResponse<DestinationDto>.Fail($"Destination {id} not found");

        var airport = await _airportRepo.GetByIdAsync(d.AirportId);
        var dto = new DestinationDto
        {
            Id = d.Id.ToString(),
            Code = d.Code,
            Name = d.Name,
            City = d.City,
            Country = d.Country,
            AirportCode = airport?.IataCode ?? d.Code,
            AirportName = airport?.Name ?? $"{d.Name} International Airport",
            ImageUrl = d.ImageUrl,
            Description = d.Description,
            Climate = d.Climate,
            BestTimeToVisit = d.BestTimeToVisit,
            PopularToursCount = d.PopularToursCount
        };

        return ApiResponse<DestinationDto>.Ok(dto);
    }
}
