using AirportManagementSystem.Helpers;
using AirportManagementSystem.Services;

namespace AirportManagementSystem.Views.AircraftAirlineView;

public class AircraftView
{
    private readonly AircraftService _aircraftService = new();

    public void Run()
    {
        List<string> options =
        [
            "Add Aircraft",
            "Update Aircraft",
            "Delete Aircraft",
            "View All Aircrafts",
            "Search Aircraft",
            "Return to Main Menu"
        ];

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
                    // AddAirportPrompt();
                    break;
                case 2:
                    // UpdateAirportPrompt();
                    break;
                case 3:
                    // DeleteAirportPrompt();
                    break;
                case 4:
                    DisplayAircraftsPrompt();
                    break;
                case 5:
                    // SearchAirportPrompt();
                    break;
                case 6:
                    running = false;
                    break;
                default:
                    Console.WriteLine("Invalid choice. Please try again.");
                    break;
            }

            ConsoleUI.PauseForUserInput();
        }
    }

    /*
    ###############################
    Display Aircrafts
    ###############################
    */
    private void DisplayAircraftsPrompt()
    {
        ConsoleUI.ClearConsole();
        ConsoleUI.ShowHeader("Airport Management System");

        try
        {
            var airports = _aircraftService.GetAll();

            if (airports.Count == 0)
            {
                ConsoleUI.ConsoleNotification(
                    "No items available.",
                    ConsoleColor.DarkGray);
                return;
            }

            ConsoleUI.ShowListItem(
                airports.Select(a => a.Display()).ToList(),
                airports.First().AircraftColList(),
                "Airports",
                70
            );
            ConsoleUI.ShowSearchedItemsCount(airports.Count, "Aircraft");
        }
        catch (Exception e)
        {
            Console.WriteLine($"An error occured: {e.Message}");
        }

    }
}