
namespace AirportManagementSystem.Helpers
{
    public class Inputter
    {
        /*
        ###############################
        Get String (no empty input)
        ###############################
         */
        public static string GetStringValue(string prompt, string emptyMessage)
        {
            while (true)
            {
                Console.Write(prompt);
                var input = Console.ReadLine();
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
        Get String (Custom validation)
        ###############################
         */
        public static string getString(
            string
            )
        {

        }

        /*
        ###############################
        Get Integer (no empty input)
        ###############################
         */
        public static int GetIntValue(
            string prompt,
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
