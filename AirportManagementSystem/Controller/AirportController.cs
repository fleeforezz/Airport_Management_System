using AirportManagementSystem.Datasources;
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

        public Airport Add(Airport item)
        {
            if (_airports.Any(a => a.Id == item.Id))
            {
                throw new ArgumentException($"An airport with ID {item.Id} already exists.");
            }
            
            Console.ReadLine("Press any key to add the airport...");
            _airports.Add(item);
            FileHandler.WriteMultiple(_filePath, _airports);
            return item;
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public void Display()
        {
            if (_airports.Count == 0)
            {
                Console.WriteLine("No airports available.");
                return;
            }

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
