using System.Text.Json;

namespace AirportManagementSystem.Datasources
{
    public class FileHandler
    {
        public static void SaveSingle<T>(T item, string filePath)
        {
            string json = JsonSerializer.Serialize(item, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(filePath, json);
            Console.WriteLine($"Data saved to {filePath}");
        }

        public static void SaveMultiple<T>(List<T> items, string filePath)
        {
            string json = JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(filePath, json);
            Console.WriteLine($"Data saved to {filePath}");
        }

        public static T ReadSingle<T>(string filePath)
        {
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"File not found: {filePath}");
            }
            string json = File.ReadAllText(filePath);
            T item = JsonSerializer.Deserialize<T>(json);
            return item;
        }

        public static List<T> ReadMultiple<T>(string filePath)
        {
            if (!File.Exists(filePath))
            {
                throw new FileNotFoundException($"File not found: {filePath}");
            }
            string json = File.ReadAllText(filePath);
            List<T> items = JsonSerializer.Deserialize<List<T>>(json);
            return items;
        }
    }
}
