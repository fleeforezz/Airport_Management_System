using AirportManagementSystem.Helpers;
using AirportManagementSystem.Models;
using AirportManagementSystem.Services;

namespace AirportManagementSystem.Views.AircraftAirlineView;

public class AircraftView
{
    private readonly AircraftService _aircraftService = new();
    private readonly AirlineService _airlineService = new();

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
            ConsoleUi.ClearConsole();
            ConsoleUi.ShowHeader("Airport Management System");
            ConsoleUi.ShowMenu(options, "Options", 30);

            var choice = ConsoleUi.ReadUserChoice(1, options.Count);

            switch (choice)
            {
                case 1:
                    AddAircraftsPrompt();
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

            ConsoleUi.PauseForUserInput();
        }
    }

    /*
    ###############################
    Display Aircrafts Prompt
    ###############################
    */
    private void DisplayAircraftsPrompt()
    {
        ConsoleUi.ClearConsole();
        ConsoleUi.ShowHeader("Airport Management System");

        try
        {
            var airports = _aircraftService.GetAll();

            if (airports.Count == 0)
            {
                ConsoleUi.ConsoleNotification(
                    "No items available.",
                    ConsoleColor.DarkGray);
                return;
            }

            ConsoleUi.ShowListItem(
                airports.Select(a => a.Display()).ToList(),
                airports.First().AircraftColList(),
                "Airports",
                70
            );
            ConsoleUi.ShowSearchedItemsCount(airports.Count, "Aircraft");
        }
        catch (Exception e)
        {
            Console.WriteLine($"An error occured: {e.Message}");
        }
    }

    /*
    ###############################
    Add Aircraft Prompt
    ###############################
    */
    private void AddAircraftsPrompt()
    {
        ConsoleUi.ClearConsole();
        ConsoleUi.ShowHeader("Airport Management System");

        var id = Inputter.GetIntValue(
            "   Enter ID: ",
            1, int.MaxValue,
            false
        );

        if (_aircraftService.GetById(id) != null)
        {
            ConsoleUi.ConsoleNotification(
                "   Airport with the given id already exists.",
                ConsoleColor.DarkGray);
            return;
        }

        var registrationNumber = Inputter.GetStringValue(
            "   Enter Registration Number: ",
            false, "   Registration Number cannot be empty");

        var model = Inputter.GetStringValue(
            "   Enter Model Name: ",
            false, "   Model Name cannot be empty");

        var capacity = Inputter.GetIntValue(
            "   Enter Capacity: ",
            1, int.MaxValue,
            false);

        // This block code is for display airlines details
        try
        {
            var airlineList = _airlineService.GetAll();

            if (airlineList.Count == 0)
            {
                ConsoleUi.ConsoleNotification(
                    "No airline available.",
                    ConsoleColor.DarkGray);
                return;
            }

            ConsoleUi.ShowListItem(
                airlineList.Select(a => a.Display()).ToList(),
                airlineList.First().AirlineColList(),
                "Airline",
                70
            );
            ConsoleUi.ShowSearchedItemsCount(airlineList.Count, "Airport");
        }
        catch (Exception e)
        {
            Console.WriteLine($"An error occured: {e.Message}");
        }

        var airlineId = Inputter.GetIntValue(
            "   Enter Airline ID: ",
            0, int.MaxValue,
            false);

        if (_airlineService.GetById(id) == null)
        {
            ConsoleUi.ConsoleNotification(
                $"Airline with ID {id} not found.",
                ConsoleColor.Red);
            return;
        }

        var aircraft = new Aircraft(id, model, registrationNumber, capacity, airlineId);

        if (_aircraftService.Add(aircraft) != null)
        {
            if (Inputter.ConfirmAction("   Do you want to add an aircraft?"))
            {
                _aircraftService.Save();
                Console.WriteLine("   Aircraft has been added !!!");
            }
        }
    }
}