

using Domain.Entities.Flight;
using Domain.Enums;
using Domain.ValueObjects;

Console.WriteLine("✈️ Welcome to Airport Management System");
Console.WriteLine("=======================================");

// Some sample flight
var flights = new List<Flight>
{
    new Flight
    {
        FlightNumber = new FlightNumber("AU123"),
        AirlineName = "British Airway",
        AircraftType = AircraftType.A320,
        Status = FlightStatus.Arrival
    },

    new Flight
    {
        FlightNumber = new FlightNumber("BA123"),
        AirlineName = "British Airway",
        AircraftType = AircraftType.B747,
        Status = FlightStatus.OnStand
    }
};

while (true)
{
    DisplayMenu();
    var choice = Console.ReadLine();

    switch (choice)
    {
        case "1":
            DisplayFlights(flights);
            break;
        case "2":
            Console.WriteLine("Goodbye!");
            break; 
        default:
            Console.WriteLine("Invalid option please try again.");
            break;
    }

    Console.WriteLine("\nPress any key to continue...");
    Console.ReadKey();
}

// Display app menu
static void DisplayMenu()
{
    Console.Clear();
    Console.WriteLine("Main Menu:");
    Console.WriteLine("1. View Flights");
    Console.WriteLine("2. Exit");
    Console.Write("Select option: ");
}

// Display Flights in List of flight we define ontop
static void DisplayFlights(List<Flight> flights)
{
    Console.Clear();
    Console.WriteLine("Current Flights: ");
    Console.WriteLine("=================");

    foreach (var flight in flights)
    {
        Console.WriteLine($"Flight: {flight.FlightNumber.Value}");
        Console.WriteLine($"Airline: {flight.AirlineName}");
        Console.WriteLine($"Aircraft: {flight.AircraftType}");
        Console.WriteLine($"Status: {flight.Status}");
        Console.WriteLine();
    }
}


