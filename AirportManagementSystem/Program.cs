using AirportManagementSystem.Helpers;
using AirportManagementSystem.Views.AircraftAirlineView;
using AirportManagementSystem.Views.AirportView;

namespace AirportManagementSystem
{
    internal class Program
    {
        static void Main(string[] args)
        {
            var airportMainView = new AirportMainView();
            var airlineAircraftMainView = new AirlineAircraftMainView();

            List<string> options =
            [
                "Airport",
                "Airline & Aircraft",
                "Flight Schedule",
                "Passenger",
                "Flight Booking",
                "Seat Selection",
                "Ticket Pricing & Payments",
                "Advanced Flight Search",
                "Admin & Booking Management",
                "Exit"
            ];

            bool running = true;

            while (running)
            {
                ConsoleUi.ClearConsole();

                ConsoleUi.ShowHeader("Airport Management System");
                ConsoleUi.ShowMenu(options, "Options", 30);

                var choice = ConsoleUi.ReadUserChoice(1, options.Count);

                switch (choice)
                {
                    case 1:
                        Console.WriteLine("Opening Airport Management...");
                        ConsoleUi.ClearConsole();

                        airportMainView.Run();
                        break;
                    case 2:
                        Console.WriteLine("Opening Airline & Aircraft Management...");
                        ConsoleUi.ClearConsole();

                        airlineAircraftMainView.Run();
                        break;
                    case 3:
                        Console.WriteLine("Opening Flight Schedule Management...");
                        ConsoleUi.ClearConsole();
                        break;
                    case 4:
                        Console.WriteLine("Opening Passenger Management...");
                        ConsoleUi.ClearConsole();
                        break;
                    case 5:
                        Console.WriteLine("Opening Flight Booking Management...");
                        ConsoleUi.ClearConsole();
                        break;
                    case 6:
                        Console.WriteLine("Opening Seat Selection Management...");
                        ConsoleUi.ClearConsole();
                        break;
                    case 7:
                        Console.WriteLine("Opening Ticket Pricing & Payments Management...");
                        ConsoleUi.ClearConsole();
                        break;
                    case 8:
                        Console.WriteLine("Opening Advanced Flight Search...");
                        ConsoleUi.ClearConsole();
                        break;
                    case 9:
                        Console.WriteLine("Opening Admin & Booking Management...");
                        ConsoleUi.ClearConsole();
                        break;
                    case 10:
                        running = false;
                        Console.WriteLine("Exiting...");
                        continue;
                }

                ConsoleUi.PauseForUserInput();
            }
        }
    }
}
