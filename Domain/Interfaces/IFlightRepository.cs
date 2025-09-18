using Domain.Entities.Flight;
using Domain.Enums;
using Domain.ValueObjects;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IFlightRepository : IRepository<Flight>
    {
        Task<Flight> GetByFlightNumberAsync(string flightNumber);
        Task<IEnumerable<FlightNumber>> GetByStatusAsync(FlightStatus status);
    }
}
