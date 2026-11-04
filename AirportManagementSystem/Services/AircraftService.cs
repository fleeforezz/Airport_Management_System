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

        private List<Aircraft> _aircraftList;

        public AircraftService()
        {
            _aircraftList = FileHandler.ReadMultiple<Aircraft>(_filePath);
        }


        /*
        ###############################
        Get All Airports Service
        ###############################
         */
        public List<Aircraft> GetAll()
        {
            return _aircraftList;
        }


        /*
        ###############################
        Get Aircraft by ID Service
        ###############################
         */
        public Aircraft? GetById(int id)
        {
            var aircraft = _aircraftList.FirstOrDefault(a => a.Id == id);
            return aircraft;
        }


        /*
        ###############################
        Add Aircraft Service
        ###############################
         */
        public Aircraft Add(Aircraft aircraft)
        {
            _aircraftList.Add(aircraft);
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

            _aircraftList.Remove(existingAircraft);
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
                return _aircraftList;
            }

            var matchedAircrafts = _aircraftList
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
            if (FileHandler.SaveSingle(_aircraftList, _filePath))
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

