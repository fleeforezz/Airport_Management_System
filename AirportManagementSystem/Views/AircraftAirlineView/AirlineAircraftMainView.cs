using AirportManagementSystem.Helpers;
using AirportManagementSystem.Services;

namespace AirportManagementSystem.Views.AircraftAirlineView;

public class AirlineAircraftMainView
{
    public void Run()
    {
        List<string> options =
        [
            "Aircraft Management",
            "Airlines Management",
            "Return to Main Menu"
        ];

        var aircraftView = new AircraftView();

        var running = true;

        while (running)
        {
            ConsoleUI.ClearConsole();
            ConsoleUI.ShowHeader("Airport Management System");
            ConsoleUI.ShowMenu(options, "Options", 30);

            var choice = ConsoleUI.ReadUserChoice(1, options.Count);

            switch (choice)
            {
                case 1:
                    aircraftView.Run();
                    break;
                case 2:
                    break;
                case 3:
                    running = false;
                    break;
                default:
                    Console.WriteLine("Invalid choice. Please try again.");
                    break;
            }

            ConsoleUI.PauseForUserInput();
        }
    }
}