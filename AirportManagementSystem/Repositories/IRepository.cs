
namespace AirportManagementSystem.Interfaces
{
    public interface IRepository<T>
    {
        List<T> GetAll();
        T? GetById(int id);
        T Add(T item);
        T Update(T item);
        bool Delete(int id);
        List<T> Search(string query);
        void Display();
        void Save();
    }
}
