using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Xml.Linq;
using EzyTest.Web.Helpers;
using EzyTest.Web.Models;

namespace EzyTest.Web.Controllers
{
    public class ExchangeRatesController : ApiController
    {
        // GET api/exchangerates
        public async Task<IEnumerable<ExchangeRate>> Get([FromUri]ExchangeRateApiRequest request)
        {
            var xml = await XmlHelpers.GetXmlFromUrl(Constants.ExchangeRateApiUrl);

            return GetSelectedCurrencies(xml, request.Currencies);
        }

        private IEnumerable<ExchangeRate> GetSelectedCurrencies(XDocument xml, IEnumerable<string> currencies)
        {
            var currenciesList = new List<ExchangeRate>();

            try
            {
                foreach (var currency in currencies)
                {
                    var matchingRows = from page in xml.Descendants().Elements("row")
                                       where currency == page?.Element("swift_code")?.Value
                                       select page;

                    var xElements = matchingRows as IList<XElement> ?? matchingRows.ToList();
                    var code = xElements.First().Element("swift_code")?.Value;
                    var buyPrice = xElements.First().Element("buy_cash")?.Value;

                    currenciesList.Add(new ExchangeRate { Code = code, Rate = Convert.ToDecimal(buyPrice) });
                }
            }
            catch (Exception ex)
            {
                // handle logging etc
            }
            
            return currenciesList;
        }
    }
}
