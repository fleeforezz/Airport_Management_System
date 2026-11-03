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
            var existing = GetById(aircraft.Id);

            if (existing == null)
            {

            }
        }

        public bool Delete(int id)
        {
            throw new NotImplementedException();
        }

        public List<Aircraft> Search(string query)
        {
            throw new NotImplementedException();
        }

        public void Display()
        {
            throw new NotImplementedException();
        }

        public void Save()
        {
            throw new NotImplementedException();
        }
    }
}

