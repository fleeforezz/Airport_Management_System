using AirportManagementSystem.Helpers;
using AirportManagementSystem.Models;
using AirportManagementSystem.Services;

namespace AirportManagementSystem.Views.AirportView
{
    public class AirportMainView
    {

        AirportService airportService = new AirportService();

        public void Run()
        {
            List<string> options = new()
            {
                "Add Airport",
                "Update Airport",
                "Delete Airport",
                "View All Airports",
                "Search Airport",
                "Return to Main Menu"
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
        Display Airport Menu
        ###############################
         */
        public void DisplayAirportMenu()
        {
            Console.WriteLine("1. Add Airport");
            Console.WriteLine("2. Update Airport");
            Console.WriteLine("3. Delete Airport");
            Console.WriteLine("4. View All Airports");
            Console.WriteLine("5. Search Airport");
            Console.WriteLine("6. Exit");
            Console.Write("Enter your choice: ");
        }

        /*
        ###############################
        Display Airports
        ###############################
         */
        public void DisplayAirports()
        {
            ConsoleUI.ClearConsole();
            var airports = airportService.GetAll();

            ConsoleUI.ShowHeader("Airport Management System");
            ConsoleUI.ShowListItem(
                airports.Select(a => a.Display()).ToList(), 
                airports.First().AirportColList(), 
                "Airports", 
                70
            );
            ConsoleUI.ShowSearchedItemsCount(airports.Count, "Airport");
        }

        /*
        ###############################
        Add Airport Prompt
        ###############################
         */
        public void AddAirportPrompt()
        {
            ConsoleUI.ClearConsole();
            ConsoleUI.ShowHeader("Airport Management System");

            Console.Write("Enter ID: ");
            int id = int.Parse(Console.ReadLine());

            Console.Write("Enter name: ");
            string name = Console.ReadLine();

            Console.Write("Enter city: ");
            string city = Console.ReadLine();

            Console.Write("Enter country: ");
            string country = Console.ReadLine();
            
            var newAirport = new Airport(id, name, city, country);

            if (airportService.Add(newAirport) == null)
            {
                Console.WriteLine("Failed to add airport.");
            }

            Console.WriteLine("Airport has been added !!!");
        }

        /*
        ###############################
        Update Airport Prompt
        ###############################
         */
        public void UpdateAirportPrompt()
        {
            ConsoleUI.ClearConsole();
            ConsoleUI.ShowHeader("Airport Management System");

            Console.Write("Enter id: ");
            int idToUpdate = int.Parse(Console.ReadLine());

            if (airportService.GetById(idToUpdate) == null)
            {
                Console.WriteLine("Airport with the given id does not exist.");
            }

            Console.Write("Enter new name: ");
            string newName = Console.ReadLine();
            Console.Write("Enter new city: ");
            string newCity = Console.ReadLine();
            Console.Write("Enter new country: ");
            string newCountry = Console.ReadLine();

            var updatedAirport = new Airport(idToUpdate, newName, newCity, newCountry);
            airportService.Update(updatedAirport);
        }

        /*
        ###############################
        Delete Airport Prompt
        ###############################
        */
        public void DeleteAirportPrompt()
        {
            ConsoleUI.ClearConsole();
            ConsoleUI.ShowHeader("Airport Management System");

            Console.Write("Enter id: ");
            int idToDelete = int.Parse(Console.ReadLine());

            if (airportService.GetById(idToDelete) == null)
            {
                Console.WriteLine("Airport with the given id does not exist.");
            }

            airportService.Delete(idToDelete);
            Console.WriteLine("Airport has been deleted !!!");
        }

        /*
        ###############################
        Search Airport Prompt
        ###############################
        */
        public void SearchAirportPrompt()
        {
            
        }
    }
}
