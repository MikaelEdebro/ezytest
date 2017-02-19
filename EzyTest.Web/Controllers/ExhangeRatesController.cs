using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using System.Xml;

namespace EzyTest.Web.Controllers
{
    public class ExchangeRate
    {
        public decimal From { get; set; }
        public decimal To { get; set; }
    }
    public class ExhangeRatesController : ApiController
    {
        // GET api/exhangerates
        public async Task<ExchangeRate> Get()
        {
            const string exhangeRateUrl = "http://www.forex.se/ratesxml.asp?id=492";

            var xml = await GetXmlFromUrl(exhangeRateUrl);
            
            // pars xml and return

            var exchangeRate = new ExchangeRate
            {
                From = 200,
                To = 2000
            };
            return exchangeRate;
        }


        private async Task<XmlDocument> GetXmlFromUrl(string url)
        {
            var xmlDocument = new XmlDocument();

            await Task.Run(() =>
            {
                xmlDocument.Load(url);
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
