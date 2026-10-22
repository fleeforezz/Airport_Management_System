using AirportManagementSystem.Models;
using AirportManagementSystem.Services;
using AirportManagementSystem.Views.AirportView;

namespace AirportManagementSystem
{
    internal class Program
    {
        static void Main(string[] args)
        {
            int choice = 0;

            do
            {
                Console.WriteLine("Airport Management System");
                Console.WriteLine("1. Airport");
                Console.WriteLine("2. Airline & Aircraft");
                Console.WriteLine("3. Flight Schedule");
                Console.WriteLine("4. Passenger");
                Console.WriteLine("5. Flight Booking");
                Console.WriteLine("6. Seat Selection");
                Console.WriteLine("7. Ticket Pricing & Payments");
                Console.WriteLine("8. Advanced Flight Search");
                Console.WriteLine("9. Admin & Booking Management");
                Console.WriteLine("10. Exit");
                Console.Write("Enter your choice: ");

                choice = Convert.ToInt32(Console.ReadLine());
                switch (choice)
                {
                    case 1:
                        AirportMainView airportMainView = new AirportMainView();
                        airportMainView.Run();
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                    case 4:
                        break;
                    case 5:
                        break;
                    case 6:
                        break;
                    case 7:
                        break;
                    case 8:
                        break;
                    case 9:
                        break;
                    case 10:
                        Console.WriteLine("Exiting...");
                        break;
                    default:
                        Console.WriteLine("Invalid choice. Please try again.");
                        break;
                }
            } while (choice != 10);
        }
    }
}
