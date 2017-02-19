using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using System.Xml;
using System.Xml.Linq;
using EzyTest.Web.Models;

namespace EzyTest.Web.Controllers
{
    public class ExhangeRatesController : ApiController
    {
        // GET api/exhangerates
        public async Task<IEnumerable<ExchangeRate>> Get()
        {
            const string exhangeRateUrl = "http://www.forex.se/ratesxml.asp?id=492";

            var currencies = new[] {"USD", "EUR"};

            var xml = await GetXmlFromUrl(exhangeRateUrl);

            return GetSelectedCurrencies(xml, currencies);
        }

        private IEnumerable<ExchangeRate> GetSelectedCurrencies(XDocument xml, string[] currencies)
        {
            var currenciesList = new List<ExchangeRate>();


            currenciesList.Add(new ExchangeRate { Code = "USD", Rate = 1000});
            currenciesList.Add(new ExchangeRate { Code = "EUR", Rate = 2332});

            return currenciesList;
        }


        private async Task<XDocument> GetXmlFromUrl(string url)
        {
            var xmlDocument = new XDocument();

            await Task.Run(() =>
            {
                xmlDocument = XDocument.Load(url);
            });

            return xmlDocument;
        }


        // GET api/values/5
        public string Get(int id)
        {
            return "value";
        }
        
    }
}
