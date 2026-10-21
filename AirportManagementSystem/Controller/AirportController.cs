using AirportManagementSystem.Datasources;
using AirportManagementSystem.Interfaces;
using AirportManagementSystem.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public void Display(Airport item)
        {
            throw new NotImplementedException();
        }

        public List<Airport> GetAll()
        {
            return _airports;
        }

        public Airport? GetById(int id)
        {
            throw new NotImplementedException();
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
