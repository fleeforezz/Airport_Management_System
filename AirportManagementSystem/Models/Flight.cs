using AirportManagementSystem.Models.Enums;

namespace AirportManagementSystem.Models;

public class Flight
{
    public int Id { get; private set; }
    public string FlightNumber { get; private set; }
    public int OriginAirportId { get; private set; }
    public int DestinationAirportId { get; private set; }
    public int AirlineId { get; private set; }
    public int AircraftId { get; private set; }
    public DateTime DepartureTime { get; private set; }
    public DateTime ArrivalTime { get; private set; }
    public FlightStatus Status { get; private set; }

    public Flight(int id, string flightNumber, int originAirportId, int destinationAirportId, int airlineId, int aircraftId, DateTime departureTime, DateTime arrivalTime, FlightStatus status)
    {
        Id = id;
        FlightNumber = flightNumber;
        OriginAirportId = originAirportId;
        DestinationAirportId = destinationAirportId;
        AirlineId = airlineId;
        AircraftId = aircraftId;
        DepartureTime = departureTime;
        ArrivalTime = arrivalTime;
        Status = status;
    }

    // Display Col
    public List<string> FlightColList()
    {
        return new List<string>
        {
            $"{"Id",-8}{"Registration Number",-35}  {"Model",-20}  {"Capacity",-10}   {"AirlineId", -8}"
        };
    }
}