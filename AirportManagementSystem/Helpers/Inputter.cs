
namespace AirportManagementSystem.Helpers
{
    public class Inputter
    {
        /*
        ###############################
        Get String (no empty index)
        ###############################
         */
        public static string GetStringValue(String prompt, String emptyMessage)
        {
            while (true)
            {
                Console.Write(prompt);
                string input = Console.ReadLine();
                if (!string.IsNullOrWhiteSpace(input))
                {
                    return input;
                }
                else
                {
                    Console.WriteLine(emptyMessage);
                }
            }
        }

        /*
        ###############################
        Get Integer (no empty index)
        ###############################
         */
        public static int GetIntValue(
            String prompt,
            int minValue, int maxValue,
            bool allowEmpty
            )
        {
            while (true)
            {
                Console.Write(prompt);
                string input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input))
                {
                    return -1;
                }

                try
                {
                    int number = Convert.ToInt32(input);
                    if (number < minValue && number > maxValue)
                    {
                        Console.WriteLine($"Please enter a value between {minValue} and {maxValue}.");
                        continue;
                    }

                    return number;
                }
                catch (Exception e)
                {
                    Console.WriteLine("Invalid input: " + e.Message);
                    throw;
                }
            }
        }
    }
}
