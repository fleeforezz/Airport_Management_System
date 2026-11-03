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
            throw new NotImplementedException();
        }

        public Aircraft? GetById(int id)
        {
            throw new NotImplementedException();
        }

        public Aircraft Add(Aircraft item)
        {
            throw new NotImplementedException();
        }

        public Aircraft Update(Aircraft item)
        {
            throw new NotImplementedException();
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

