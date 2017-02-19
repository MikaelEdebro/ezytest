using System.Threading.Tasks;
using System.Xml.Linq;

namespace EzyTest.Web.Helpers
{
    public static class XmlHelpers
    {
        public static async Task<XDocument> GetXmlFromUrl(string url)
        {
            var xmlDocument = new XDocument();

            await Task.Run(() =>
            {
                xmlDocument = XDocument.Load(url);
            });

            return xmlDocument;
        }
    }
}