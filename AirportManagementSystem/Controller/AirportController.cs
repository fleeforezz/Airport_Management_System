using AirportManagementSystem.Datasources;
using AirportManagementSystem.Interfaces;
using AirportManagementSystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Controller
{
    public class AirportController : Interfaces.IList
    {
        FileHandler fileHandler = new FileHandler();
        private List<Airport> airports = fileHandler.ReadMultiple<Airport>("airports.txt");

        T IList.Add<T>(T item)
        {
            throw new NotImplementedException();
        }

        void IList.Delete<T>(int id)
        {
            throw new NotImplementedException();
        }

        List<Airport> IList.GetAll<Airport>()
        {
            return airports;
        }

        Airport IList.GetById<Airport>(int id)
        {
            throw new NotImplementedException();
        }

        List<T> IList.Search<T>(string query)
        {
            throw new NotImplementedException();
        }

        T IList.Update<T>(T item)
        {
            throw new NotImplementedException();
        }
    }
}
