using AirportManagementSystem.Datasources;
using AirportManagementSystem.Interfaces;
using AirportManagementSystem.Models;

namespace AirportManagementSystem.Services;

public class AirlineService : IRepository<Airline>
{
    private readonly string _filePath = Path.Combine(
        "..", "..", "..",
        "Database",
        "airline.json"
    );

    private readonly List<Airline> _airlineList;

    public AirlineService()
    {
        _airlineList = FileHandler.ReadMultiple<Airline>(_filePath);
    }


    /*
    ###############################
    Get All Airports Service
    ###############################
    */
    public List<Airline> GetAll()
    {
        return  _airlineList;
    }

    public Airline? GetById(int id)
    {
        var airline = _airlineList.FirstOrDefault(x => x.Id == id);
        return airline;
    }

    public Airline Add(Airline item)
    {
        throw new NotImplementedException();
    }

    public Airline Update(Airline item)
    {
        throw new NotImplementedException();
    }

    public bool Delete(int id)
    {
        throw new NotImplementedException();
    }

    public List<Airline> Search(string query)
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