using AirportManagementSystem.Datasources;
using AirportManagementSystem.Helpers;
using AirportManagementSystem.Interfaces;
using AirportManagementSystem.Models;

namespace AirportManagementSystem.Services
{
    public class AirportService : IRepository<Airport>
    {
        private readonly string _filePath = Path.Combine(
            "..", "..", "..",
            "Database",
            "airports.json"
        );

        private List<Airport> _airports;

        public AirportService()
        {
            _airports = FileHandler.ReadMultiple<Airport>(_filePath);
        }

        public Airport Add(Airport airport)
        {

            if (GetById(airport.Id) != null)
            {
                Console.WriteLine("Airport exists!!!");
                return null;
            }

            _airports.Add(airport);

            return airport;

        }

        public void Delete(int id)
        {
            if (GetById(id) != null)
            {
                _airports.Remove(GetById(id));
                Console.WriteLine("Remove success");
            }
            else
            {
                Console.WriteLine($"Airport with ID {id} not found");
            }
        }

        public void Display()
        {
            string header = "| {\"ID\",-8} | {\"Name\",-35} | {\"City\",-20} | {\"Country\",-15} |";

            if (_airports.Count == 0)
            {
                Console.WriteLine(header);
                Console.WriteLine("No airports available.");
                Console.WriteLine(new string('-', 90));
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
            Console.WriteLine(new string('-', 90));
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
                return null;
            }
            return airport;
        }

        public void Save()
        {
            if (FileHandler.SaveSingle(_airports, _filePath))
            {
                Console.WriteLine("Airports saved successfully.");
            }
            else
            {
                Console.WriteLine("Failed to save airports.");
            }
        }

        public List<Airport> Search(string query)
        {
            foreach (var airport in _airports)
            {
                if (airport.Equals(_airports))
                {
                    return new List<Airport> { airport };
                }
            }
            return new List<Airport>();
        }

        public Airport Update(Airport item)
        {
            var existingAirport = GetById(item.Id);

            if (existingAirport == null)
            {
                Console.WriteLine($"Airport with ID {item.Id} not found.");
                return null;
            }

            existingAirport.Name = item.Name;
            existingAirport.City = item.City;
            existingAirport.Country = item.Country;

            FileHandler.SaveSingle(_airports, _filePath);

            return item;
        }
    }
}
