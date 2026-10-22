using AirportManagementSystem.Datasources;
using AirportManagementSystem.Helpers;
using AirportManagementSystem.Interfaces;
using AirportManagementSystem.Models;

namespace AirportManagementSystem.Controller
{
    public class AirportController : IRepository<Airport>
    {
        private readonly string _filePath = Path.Combine(
            "..", "..", "..",
            "Data", 
            "airports.json"
        );

        private List<Airport> _airports;

        public AirportController()
        {
            _airports = FileHandler.ReadMultiple<Airport>(_filePath);
        }

        public Airport Add()
        {

            int id = Inputter.GetIntValue(
                "Enter ID: ",
                1,
                99,
                false
                );

            if (GetById(id) == null)
            {
                string? name = Inputter.GetStringValue(
                "Enter airport name: ",
                "Airport name cannot be empty."
                );

                string? city = Inputter.GetStringValue(
                    "Enter airport city: ",
                    "Airport city cannot be empty."
                    );

                string? country = Inputter.GetStringValue(
                    "Enter airport country: ",
                    "Airport country cannot be empty."
                    );

                var newAirport = new Airport(id, name, city, country);

                _airports.Add(newAirport);
                FileHandler.SaveSingle(_airports, _filePath);

                return newAirport;
            } 
            else
            {
                Console.WriteLine("Airport exists!!!");
                return null;
            }
            
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
