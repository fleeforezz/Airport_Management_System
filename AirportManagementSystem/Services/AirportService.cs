using System.Collections;
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
            "airport.json"
        );

        private readonly List<Airport> _airports;

        public AirportService()
        {
            _airports = FileHandler.ReadMultiple<Airport>(_filePath);
        }

        /*
        ###############################
        Add Airports Service
        ###############################
         */
        public Airport Add(Airport airport)
        {
            _airports.Add(airport);
            return airport;

        }


        /*
        ###############################
        Delete Airports Service
        ###############################
         */
        public bool Delete(int id)
        {
            var existingAirport = GetById(id);

            if (existingAirport == null)
            {
                return false;
            }

            _airports.Remove(existingAirport);
            return true;
        }


        /*
        ###############################
        Display Airports Service
        ###############################
         */
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


        /*
        ###############################
        Get All Airports Service
        ###############################
         */
        public List<Airport> GetAll()
        {
            return _airports;
        }


        /*
        ###############################
        Get Airport by ID Service
        ###############################
         */
        public Airport? GetById(int id)
        {
            var airport = _airports.FirstOrDefault(a => a.Id == id);
            return airport;
        }


        /*
        ###############################
        Save Airports Service
        ###############################
         */
        public void Save()
        {
            if (FileHandler.SaveSingle(_airports, _filePath))
            {
                Console.WriteLine("   Airports saved successfully.");
            }
            else
            {
                Console.WriteLine("   Failed to save airports.");
            }
        }


        /*
        ###############################
        Search Airports Service
        ###############################
         */
        public List<Airport> Search(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return _airports;
            }

            var matchedAirports = _airports
                .Where(a => a.Name.Contains(query.Trim(), StringComparison.OrdinalIgnoreCase))
                .ToList();

            return matchedAirports;
        }


        /*
        ###############################
        Update Airports Service
        ###############################
         */
        public Airport Update(Airport item)
        {
            var existingAirport = GetById(item.Id);

            if (existingAirport == null)
            {
                return null;
            }

            existingAirport.Name = item.Name;
            existingAirport.City = item.City;
            existingAirport.Country = item.Country;

            return existingAirport;
        }
    }
}
