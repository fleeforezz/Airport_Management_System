using AirportManagementSystem.Controller;

namespace AirportManagementSystem
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int choice = 0;
            AirportController airportController = new AirportController();

            do
            {
                Console.WriteLine("Airport Management System");
                Console.WriteLine("1. Add Airport");
                Console.WriteLine("2. Update Airport");
                Console.WriteLine("3. Delete Airport");
                Console.WriteLine("4. View All Airports");
                Console.WriteLine("5. Search Airport");
                Console.WriteLine("6. Exit");
                Console.Write("Enter your choice: ");
                choice = Convert.ToInt32(Console.ReadLine());
                switch (choice)
                {
                    case 1:
                        // Add Airport
                        //airportController.Add(new Airport());
                        break;
                    case 2:
                        // Update Airport
                        break;
                    case 3:
                        // Delete Airport
                        break;
                    case 4:
                        // View All Airports
                        airportController.Display();
                        break;
                    case 5:
                        // Search Airport
                        break;
                    case 6:
                        Console.WriteLine("Exiting...");
                        break;
                    default:
                        Console.WriteLine("Invalid choice. Please try again.");
                        break;
                }
            } while (choice != 6);
        }
    }
}
