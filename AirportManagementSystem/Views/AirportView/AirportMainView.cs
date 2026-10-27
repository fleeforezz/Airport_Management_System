using AirportManagementSystem.Models;
using AirportManagementSystem.Services;

namespace AirportManagementSystem.Views.AirportView
{
    public class AirportMainView
    {

        AirportService airportService = new AirportService();

        public void Run()
        {
            int choice = 0;
            do
            {
                DisplayAirportMenu();
                choice = Convert.ToInt32(Console.ReadLine());
                switch (choice)
                {
                    case 1:
                        // Add Airport
                        AddAirportPrompt();
                        break;
                    case 2:
                        // Update Airport
                        UpdateAirportPrompt();
                        break;
                    case 3:
                        // Delete Airport
                        DeleteAirportPrompt();
                        break;
                    case 4:
                        // View All Airports
                        DisplayAirports();
                        break;
                    case 5:
                        // Search Airport
                        SearchAirportPrompt();
                        break;
                    case 6:
                        // Exit
                        Console.WriteLine("Returning to main menu...");
                        break;
                    default:
                        Console.WriteLine("Invalid choice. Please try again.");
                        break;
                }
            } while (choice != 6);
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
            var airports = airportService.GetAll();

            Console.WriteLine("| {0,-8} | {1,-35} | {2,-20} | {3,-15} |", "ID", "Name", "City", "Country");
            Console.WriteLine(new string('-', 90));
            foreach (var airport in airports)
            {
                Console.WriteLine(airport.Display());
            }
        }

        /*
        ###############################
        Add Airport Prompt
        ###############################
         */
        public void AddAirportPrompt()
        {
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
