using AirportManagementSystem.Helpers;
using AirportManagementSystem.Models;
using AirportManagementSystem.Services;

namespace AirportManagementSystem.Views.AirportView
{
    public class AirportMainView
    {

        private readonly AirportService _airportService = new();

        public void Run()
        {
            List<string> options =
            [
                "Add Airport",
                "Update Airport",
                "Delete Airport",
                "View All Airports",
                "Search Airport",
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
                        AddAirportPrompt();
                        break;
                    case 2:
                        UpdateAirportPrompt();
                        break;
                    case 3:
                        DeleteAirportPrompt();
                        break;
                    case 4:
                        DisplayAirports();
                        break;
                    case 5:
                        SearchAirportPrompt();
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
        Display Airports
        ###############################
         */
        private void DisplayAirports()
        {
            ConsoleUI.ClearConsole();
            ConsoleUI.ShowHeader("Airport Management System");

            try
            {
                var airports = _airportService.GetAll();

                if (airports.Count == 0)
                {
                    ConsoleUI.ConsoleNotification(
                        "No items available.",
                        ConsoleColor.DarkGray);
                    return;
                }

                ConsoleUI.ShowListItem(
                    airports.Select(a => a.Display()).ToList(),
                    airports.First().AirportColList(),
                    "Airports",
                    70
                );
                ConsoleUI.ShowSearchedItemsCount(airports.Count, "Airport");
            }
            catch (Exception e)
            {
                Console.WriteLine($"An error occured: {e.Message}");
            }

        }

        /*
        ###############################
        Add Airport Prompt
        ###############################
         */
        private void AddAirportPrompt()
        {
            ConsoleUI.ClearConsole();
            ConsoleUI.ShowHeader("Airport Management System");

            var id = Inputter.GetIntValue(
                "   Enter ID: ",
                1, int.MaxValue,
                false
            );

            if (_airportService.GetById(id) != null)
            {
                ConsoleUI.ConsoleNotification(
                    "   Airport with the given id already exists.",
                    ConsoleColor.DarkGray);
                return;
            }

            var name = Inputter.GetStringValue(
                "   Enter name: ",
                false, "Name cannot be empty.");

            var city = Inputter.GetStringValue(
                "   Enter city: ",
                false, "City cannot be empty.");

            var country = Inputter.GetStringValue(
                "   Enter country: ",
                false, "Country cannot be empty.");

            var airport = new Airport(id, name,  city, country);

            if (_airportService.Add(airport) != null)
            {
                if (Inputter.ConfirmAction("   Do you want to save this airport? "))
                {
                    _airportService.Save();
                    Console.WriteLine("   Airport has been added !!!");
                }
            }
            
        }

        /*
        ###############################
        Update Airport Prompt
        ###############################
         */
        private void UpdateAirportPrompt()
        {
            ConsoleUI.ClearConsole();
            ConsoleUI.ShowHeader("Airport Management System");

            var idToUpdate = Inputter.GetIntValue(
                "   Enter id: ",
                1, int.MaxValue,
                false
                );

            try
            {
                var existingAirport = _airportService.GetById(idToUpdate);

                if (existingAirport == null)
                {
                    ConsoleUI.ConsoleNotification(
                        "Airport with the given id does not exist.",
                        ConsoleColor.DarkRed);
                    return;
                }

                ConsoleUI.ConsoleNotification(
                    $"Airport found: {existingAirport.Name}",
                    ConsoleColor.Green);

                var name = Inputter.GetStringValue(
                    "   Enter name: ",
                    true, "");
                if (name.Length == 0) name = existingAirport.Name;

                var city = Inputter.GetStringValue(
                    "   Enter city: ",
                    true, "");
                if (city.Length == 0) city = existingAirport.City;

                var country = Inputter.GetStringValue(
                    "   Enter country: ",
                    true, "");
                if (country.Length == 0) country = existingAirport.Country;

                if (name.Length == 0 || city.Length == 0 || country.Length == 0 &&
                    city.Equals(existingAirport.Name) ||
                    country.Equals(existingAirport.Country)
                    )
                {
                    ConsoleUI.ConsoleNotification(
                        "No changes",
                        ConsoleColor.DarkGray);
                }

                var updatedAirport = new Airport(idToUpdate, name, city, country);

                if (_airportService.Update(updatedAirport) != null)
                {
                    if (Inputter.ConfirmAction("   Do you want to update this airport? "))
                    {
                        _airportService.Save();
                        Console.WriteLine("   Airport has been updated !!!");
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"An error occured: {e.Message}");
            }

        }

        /*
        ###############################
        Delete Airport Prompt
        ###############################
        */
        private void DeleteAirportPrompt()
        {
            ConsoleUI.ClearConsole();
            ConsoleUI.ShowHeader("Airport Management System");

            var idToDelete = Inputter.GetIntValue(
                "   Enter id: ",
                1, int.MaxValue,
                false
            );

            try
            {
                var existingAirport = _airportService.GetById(idToDelete);

                if (existingAirport == null)
                {
                    ConsoleUI.ConsoleNotification(
                        "Airport with the given id does not exist.",
                        ConsoleColor.DarkRed);
                    return;
                }

                ConsoleUI.ConsoleNotification(
                    $"Airport found: {existingAirport.Name}",
                    ConsoleColor.Green);

                if (_airportService.Delete(idToDelete))
                {
                    if (Inputter.ConfirmAction("   Do you want to remove this airport? "))
                    {
                        _airportService.Save();
                        Console.WriteLine("   Airport has been deleted !!!");
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"An error occured: {e.Message}");
            }
        }

        /*
        ###############################
        Search Airport Prompt
        ###############################
        */
        private void SearchAirportPrompt()
        {
            ConsoleUI.ClearConsole();
            ConsoleUI.ShowHeader("Airport Management System");

            var name = Inputter.GetStringValue(
                "   Enter airport name: ",
                true, "");

            try
            {
                var airports = _airportService.Search(name);

                if (airports.Count == 0)
                {
                    ConsoleUI.ConsoleNotification(
                        "No items available.",
                        ConsoleColor.DarkGray);
                    return;
                }

                ConsoleUI.ShowListItem(
                    airports.Select(a => a.Display()).ToList(),
                    airports.First().AirportColList(),
                    "Airports",
                    70
                );
                ConsoleUI.ShowSearchedItemsCount(airports.Count, "Airport");
            }
            catch (Exception e)
            {
                Console.WriteLine($"An error occured: {e.Message}");
            }
        }
    }
}
