using Domain.Entities.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    /// <summary>
    /// This is an interface - no implementation here, just the method signatures
    /// It's generic over T.
    /// + T must be a subclass of your Entity base class (Because of where T : Entity)
    /// + This means you can use the same interface for Flight, User, Contract, etc.
    /// The implementating classes (like FlightRepository, UserRepository) will provide actual database access logic.
    /// </summary>
    /// <typeparam name="T"></typeparam>

    // All methods are synchronous (Returning Task/Task<T>) which is standard for I/O operations like database calls. 
    public interface IRepository<T> where T : Entity
    {
        // GetByIdAsync =====================================================
        // Fetch one entity by its ID
        // Return null if not found (hence T?)
        // Example: var flight = await flightRepository.GetIdAsync("someId");
        // ==================================================================
        Task<T?> GetByIdAsync(string id);

        // GetAllAsync ==========================
        // Get all entities of type ID
        // Could be used for lists, dropdown, etc
        // ======================================
        Task<IEnumerable<T>> GetAllAsync();

        // FindAsync ==========================
        // Fetch one entity by its ID
        // Return null if not found (hence T?)
        // ====================================
        Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate);

        // ====================================
        // Fetch one entity by its ID
        // Return null if not found (hence T?)
        // ====================================
        Task<T> AddAsync(T entity);

        // ====================================
        // Fetch one entity by its ID
        // Return null if not found (hence T?)
        // ====================================
        Task UpdateAsync(T entity);

        // ====================================
        // Fetch one entity by its ID
        // Return null if not found (hence T?)
        // ====================================
        Task DeleteAsync(string id);

        // ====================================
        // Fetch one entity by its ID
        // Return null if not found (hence T?)
        // ====================================
        Task<bool> ExistsAsync(string id);
    }
}
