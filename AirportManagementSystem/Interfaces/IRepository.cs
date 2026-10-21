
namespace AirportManagementSystem.Interfaces
{
    public interface IRepository<T>
    {
        List<T> GetAll();
        T? GetById(int id);
        T Add();
        T Update(T item);
        void Delete(int id);
        List<T> Search(string query);
        void Display();
    }
}
