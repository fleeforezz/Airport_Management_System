using AirportManagementSystem.Helpers;
using AirportManagementSystem.Views.AirportView;

namespace AirportManagementSystem
{
    internal class Program
    {
        static void Main(string[] args)
        {

            List<string> options = new()
            {
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
            };

            bool running = true;

            while (running)
            {
                ConsoleUI.ClearConsole();

                ConsoleUI.ShowHeader("Airport Management System");
                ConsoleUI.ShowMenu(options, "Options", 30);

                int choice = ConsoleUI.ReadUserChoice(1, options.Count);

                switch (choice)
                {
                    case 1:
                        Console.WriteLine("Opening Airport Management...");
                        ConsoleUI.ClearConsole();

                        AirportMainView airportMainView = new AirportMainView();
                        airportMainView.Run();
                        break;
                    case 2:
                        Console.WriteLine("Opening Airline & Aircraft Management...");
                        ConsoleUI.ClearConsole();
                        break;
                    case 3:
                        Console.WriteLine("Opening Flight Schedule Management...");
                        ConsoleUI.ClearConsole();
                        break;
                    case 4:
                        Console.WriteLine("Opening Passenger Management...");
                        ConsoleUI.ClearConsole();
                        break;
                    case 5:
                        Console.WriteLine("Opening Flight Booking Management...");
                        ConsoleUI.ClearConsole();
                        break;
                    case 6:
                        Console.WriteLine("Opening Seat Selection Management...");
                        ConsoleUI.ClearConsole();
                        break;
                    case 7:
                        Console.WriteLine("Opening Ticket Pricing & Payments Management...");
                        ConsoleUI.ClearConsole();
                        break;
                    case 8:
                        Console.WriteLine("Opening Advanced Flight Search...");
                        ConsoleUI.ClearConsole();
                        break;
                    case 9:
                        Console.WriteLine("Opening Admin & Booking Management...");
                        ConsoleUI.ClearConsole();
                        break;
                    case 10:
                        running = false;
                        Console.WriteLine("Exiting...");
                        continue;
                }

                ConsoleUI.PauseForUserInput();
            }
        }
    }
}
