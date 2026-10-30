using System.Text.Json;

namespace AirportManagementSystem.Datasources
{
    public class FileHandler
    {
        public static bool SaveSingle<T>(T item, string filePath)
        {
            try
            {
                string json = JsonSerializer.Serialize(item, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(filePath, json);
                Console.WriteLine($"Data saved to {filePath}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving data to {filePath}: {ex.Message}");
                return false;
            }
        }

        public static bool SaveMultiple<T>(List<T> items, string filePath)
        {
            try
            {
                string json = JsonSerializer.Serialize(items, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(filePath, json);
                Console.WriteLine($"Data saved to {filePath}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error saving data to {filePath}: {ex.Message}");
                return false;
            }
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
