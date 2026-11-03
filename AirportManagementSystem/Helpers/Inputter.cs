
using System.Text.RegularExpressions;

namespace AirportManagementSystem.Helpers
{
    public class Inputter
    {
        /*
        ###############################
        Get String (no empty input)
        ###############################
         */
        public static string GetStringValue(
            string prompt,
            bool allowEmpty,
            string emptyMessage
            )
        {
            while (true)
            {
                Console.Write(prompt);
                var input = Console.ReadLine();

                if (input == null)
                {
                    return emptyMessage;
                }

                if (string.IsNullOrWhiteSpace(input) && !allowEmpty)
                {
                    Console.WriteLine(emptyMessage);
                    continue;
                }

                return input;
            }
        }

        /*
        ###############################
        Get String (Custom validation)
        ###############################
         */
        public static string getString(
            string prompt,
            bool allowEmpty, string emptyMessage,
            bool allowRegex, string regexPattern, string regexMessage,
            bool allowUnique, string uniqueMessage,
            Predicate<string> validator
            )
        {
            while (true)
            {
                Console.WriteLine(prompt);
                string input = Console.ReadLine();

                if (input == null)
                {
                    Console.WriteLine("Input cannot be null.");
                    continue;
                }

                if (allowEmpty && string.IsNullOrWhiteSpace(input))
                {
                    Console.WriteLine(emptyMessage);
                    return string.Empty;
                }

                if (allowRegex && !string.IsNullOrWhiteSpace(regexPattern) && !Regex.IsMatch(input, regexPattern))
                {
                    Console.WriteLine(regexMessage);
                    continue;
                }

                if (validator != null && !validator(input))
                {
                    if (allowUnique)
                    {
                        Console.WriteLine(uniqueMessage);

                    }
                    else
                    {
                        Console.WriteLine("Invalid input.");
                    }
                }

                return input;
            }
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
                var input = Console.ReadLine();

                if (string.IsNullOrWhiteSpace(input) && allowEmpty)
                {
                    return -1;
                }

                try
                {
                    var number = Convert.ToInt32(input);
                    if (number < minValue && number > maxValue)
                    {
                        Console.WriteLine($"   Please enter a value between {minValue} and {maxValue}.");
                        continue;
                    }

                    return number;
                }
                catch (Exception e)
                {
                    Console.WriteLine("   Invalid input: " + e.Message);
                }
            }
        }


        /*
        ###############################
        Confirm Action
        ###############################
         */
        public static bool ConfirmAction(string prompt)
        {
            Console.Write(   prompt + " (y/n): ");
            return Console.ReadLine()?.Trim().ToLower() == "y";
        }
    }
}
