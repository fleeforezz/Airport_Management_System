using AirportManagementSystem.Datasources;
using AirportManagementSystem.Interfaces;
using AirportManagementSystem.Models;

namespace AirportManagementSystem.Services
{
    public class AircraftService : IRepository<Aircraft>
    {
        private readonly string _filePath = Path.Combine(
            "..", "..", "..",
            "Database",
            "aircraft.json"
        );

        private List<Aircraft> _aircrafts;

        public AircraftService()
        {
            _aircrafts = FileHandler.ReadMultiple<Aircraft>(_filePath);
        }


        /*
        ###############################
        Get All Airports Service
        ###############################
         */
        public List<Aircraft> GetAll()
        {
            return _aircrafts;
        }


        /*
        ###############################
        Get Aircraft by ID Service
        ###############################
         */
        public Aircraft? GetById(int id)
        {
            var aircraft = _aircrafts.FirstOrDefault(a => a.Id == id);
            return aircraft;
        }


        /*
        ###############################
        Add Aircraft Service
        ###############################
         */
        public Aircraft Add(Aircraft aircraft)
        {
            _aircrafts.Add(aircraft);
            return aircraft;
        }


        /*
        ###############################
        Update Aircraft Service
        ###############################
         */
        public Aircraft Update(Aircraft aircraft)
        {
            var existingAircraft = GetById(aircraft.Id);

            if (existingAircraft == null)
            {
                return null;
            }

            existingAircraft.RegistrationNumber =  aircraft.RegistrationNumber;
            existingAircraft.Model = aircraft.Model;
            existingAircraft.Capacity = aircraft.Capacity;
            existingAircraft.AirlineId =  aircraft.AirlineId;

            return existingAircraft;
        }


        /*
        ###############################
        Delete Aircraft Service
        ###############################
         */
        public bool Delete(int id)
        {
            var existingAircraft = GetById(id);

            if (existingAircraft == null)
            {
                return false;
            }

            _aircrafts.Remove(existingAircraft);
            return true;
        }


        /*
        ###############################
        Search Aircraft Service
        ###############################
         */
        public List<Aircraft> Search(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return _aircrafts;
            }

            var matchedAircrafts = _aircrafts
                .Where(a => a.Model.Contains(query.Trim(), StringComparison.OrdinalIgnoreCase))
                .ToList();

            return matchedAircrafts;
        }

        public void Display()
        {
            throw new NotImplementedException();
        }

        public void Save()
        {
            if (FileHandler.SaveSingle(_aircrafts, _filePath))
            {
                Console.WriteLine("   Aircraft saved successfully.");
            }
            else
            {
                Console.WriteLine("   Failed to save aircraft.");
            }
        }
    }
}

