using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AirportManagementSystem.Interfaces
{
    public interface IList
    {
        List<T> GetAll<T>();
        T GetById<T>(int id);
        T Add<T>(T item);
        T Update<T>(T item);
        void Delete<T>(int id);
        List<T> Search<T>(string query);
    }
}
