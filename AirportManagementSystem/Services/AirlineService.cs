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

    /*
    ###############################
    Get Airline by ID Service
    ###############################
    */
    public Airline? GetById(int id)
    {
        var airline = _airlineList.FirstOrDefault(x => x.Id == id);
        return airline;
    }

    /*
    ###############################
    Add Airline Service
    ###############################
    */
    public Airline Add(Airline airline)
    {
        _airlineList.Add(airline);
        return airline;
    }


    /*
    ###############################
    Update Airline Service
    ###############################
    */
    public Airline Update(Airline airline)
    {
        var existingAirline = GetById(airline.Id);

        if (existingAirline == null)
        {
            return null;
        }

        existingAirline.Name = airline.Name;
        existingAirline.Country = airline.Country;

        return existingAirline;
    }


    /*
    ###############################
    Delete Airline Service
    ###############################
    */
    public bool Delete(int id)
    {
        var  existingAirline = GetById(id);

        if (existingAirline == null)
        {
            return false;
        }

        _airlineList.Remove(existingAirline);
        return true;
    }

    public List<Airline> Search(string query)
    {
        if (string.IsNullOrEmpty(query))
        {
            return _airlineList;
        }

        var matchedAirline = _airlineList
            .Where(x => x.Name.Contains(query.Trim(), StringComparison.OrdinalIgnoreCase))
            .ToList();

        return  matchedAirline;
    }

    public void Display()
    {
        throw new NotImplementedException();
    }

    public void Save()
    {
        if (FileHandler.SaveSingle(_airlineList, _filePath))
        {
            Console.WriteLine("   Airline saved successfully.");
        }
        else
        {
            Console.WriteLine("   Failed to save airline.");
        }
    }
}