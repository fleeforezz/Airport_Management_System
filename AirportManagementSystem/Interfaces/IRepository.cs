using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Interfaces
{
    public interface IRepository<T>
    {
        List<T> GetAll();
        T? GetById(int id);
        T Add(T item);
        T Update(T item);
        void Delete(int id);
        List<T> Search(string query);
        void Display(T item);
    }
}
