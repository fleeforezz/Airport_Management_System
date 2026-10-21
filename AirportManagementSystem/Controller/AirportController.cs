using AirportManagementSystem.Datasources;
using AirportManagementSystem.Helpers;
using AirportManagementSystem.Interfaces;
using AirportManagementSystem.Models;

namespace AirportManagementSystem.Controller
{
    public class AirportController : IRepository<Airport>
    {
        private readonly string _filePath = "D:\\Github\\fleeforezz\\Airport_Management_System\\AirportManagementSystem\\Data\\airports.json";
        private List<Airport> _airports;

        public AirportController()
        {
            _airports = FileHandler.ReadMultiple<Airport>(_filePath);
        }

        public Airport Add()
        {
            //Console.Write("Enter airport ID: ");
            //int id = Convert.ToInt32(Console.ReadLine());

            //if (_airports.Any(a => a.Id == id))
            //{
            //    throw new ArgumentException($"An airport with ID {id} already exists.");
            //}


            string? name = Inputter.GetStringValue("Enter airport name: ", "Airport name cannot be empty.");
            string? city = Inputter.GetStringValue("Enter airport city: ", "Airport city cannot be empty.");
            string? country = Inputter.GetStringValue("Enter airport country: ", "Airport country cannot be empty.");

            var airport = new Airport
            {
                Id = id,
                Name = name,
                City = city,
                Country = country
            };

            _airports.Add(airport);
            FileHandler.WriteMultiple(_filePath, _airports);

            return airport;
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public void Display()
        {
            if (_airports.Count == 0)
            {
                Console.WriteLine(
                    $"| {"ID",-8} | {"Name",-35} | {"City",-20} | {"Country",-15} |"
                );
                Console.WriteLine("No airports available.");
                return;
            }

            Console.WriteLine(
                $"| {"ID",-8} | {"Name",-35} | {"City",-20} | {"Country",-15} |"
             );
            Console.WriteLine(new string('-', 90));
            foreach (var airport in _airports)
            {
                Console.WriteLine(airport.Display());
            }
        }

        public List<Airport> GetAll()
        {
            return _airports;
        }

        public Airport? GetById(int id)
        {
            var airport = _airports.FirstOrDefault(a => a.Id == id);
            if (airport == null)
            {
                Console.WriteLine($"Airport with ID {id} not found.");
                return null;
            }
            return airport;
        }

        public List<Airport> Search(string query)
        {
            throw new NotImplementedException();
        }

        public Airport Update(Airport item)
        {
            throw new NotImplementedException();
        }
    }
}
