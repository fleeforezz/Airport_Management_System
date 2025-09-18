using Domain.Entities.Flight;
using Domain.Enums;
using Domain.Interfaces;
using Domain.ValueObjects;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.InMemory
{
    public class InMemoryFlightRepository : IFlightRepository
    {
        private readonly ConcurrentDictionary<string, Flight> _flights = new();

        public async Task<Flight> AddAsync(Flight entity)
        {
            throw new NotImplementedException();
        }

        public async Task DeleteAsync(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> ExistsAsync(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Flight>> FindAsync(Expression<Func<Flight, bool>> predicate)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Flight>> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<Flight> GetByFlightNumberAsync(string flightNumber)
        {
            throw new NotImplementedException();
        }

        public async Task<Flight?> GetByIdAsync(string id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<FlightNumber>> GetByStatusAsync(FlightStatus status)
        {
            throw new NotImplementedException();
        }

        public async Task UpdateAsync(Flight entity)
        {
            throw new NotImplementedException();
        }
    }
}
