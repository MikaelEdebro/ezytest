using System.Collections.Generic;

namespace EzyTest.Web.Models
{
    public class ExchangeRateApiRequest
    {
        public IEnumerable<string> Currencies { get; set; }
    }
}